# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Copy root package files first (for caching)
COPY package*.json ./
COPY tsconfig*.json ./

# Copy workspace package files so npm can resolve dependencies
COPY v1/package*.json ./v1/

# Install dependencies for v1 only
RUN npm install --workspace v1

# Copy all source files
COPY . .

# Build NestJS app for v1
RUN npm run build --workspace v1

# Stage 2: Runtime
FROM node:22-alpine
WORKDIR /app

# Copy built artifacts and production dependencies
COPY --from=builder /app/v1/dist ./dist
COPY --from=builder /app/v1/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["node", "dist/main.js"]
