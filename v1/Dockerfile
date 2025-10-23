# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Copy only package files first (for layer caching)
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies (just for v1 workspace)
RUN npm install --workspace v1 --omit=dev

# Copy app source
COPY v1 ./v1

# Build the NestJS app
RUN npm run build --workspace v1

# Stage 2: Runtime
FROM node:22-alpine
WORKDIR /app

# Copy built artifacts and production dependencies
COPY --from=builder /app/v1/dist ./dist
COPY --from=builder /app/v1/package*.json ./

RUN npm ci --omit=dev

EXPOSE 3000
CMD ["node", "dist/main.js"]
