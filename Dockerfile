# Stage 1: Builder
ARG WORKSPACE=v1
FROM node:22-alpine AS builder
WORKDIR /app

# Make ARG available in this stage
ARG WORKSPACE

# Copy root package files for caching
COPY package*.json package-lock.json ./

# Copy workspace package.json only
COPY $WORKSPACE/package*.json ./$WORKSPACE/

# Install dependencies for the workspace
RUN npm install --workspace $WORKSPACE --omit=dev

# Copy workspace source
COPY $WORKSPACE ./$WORKSPACE/

# Build workspace
RUN npm run build --workspace $WORKSPACE

# Stage 2: Runtime
FROM node:22-alpine
WORKDIR /app

# Pass ARG again if needed
ARG WORKSPACE

# Copy built artifacts
COPY --from=builder /app/$WORKSPACE/dist ./dist
COPY --from=builder /app/$WORKSPACE/package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["node", "dist/main.js"]
