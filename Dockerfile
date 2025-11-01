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
# RUN npm install --workspace $WORKSPACE
# RUN npm install --workspace $WORKSPACE --omit=dev --legacy-peer-deps
RUN npm ci

# Copy workspace source
COPY $WORKSPACE ./$WORKSPACE/

# Build workspace
RUN npm run build --workspace $WORKSPACE

# -----------------------------
# Stage 2: Runtime
# -----------------------------
FROM node:22-alpine

WORKDIR /app
ARG WORKSPACE

# Copy only the built artifacts to /app/dist
COPY --from=builder /app/$WORKSPACE/dist ./

# Copy workspace node_modules for runtime
COPY --from=builder /app/$WORKSPACE/node_modules ./node_modules

# Copy package.json (optional, if needed by app)
COPY --from=builder /app/$WORKSPACE/package*.json ./
COPY --from=builder /app/package-lock.json ./

# Expose your application port
EXPOSE 8746

# Start the app
CMD ["node", "dist/main.js"]