ARG WORKSPACE=v1
FROM node:22-alpine AS builder
WORKDIR /app

# Copy root package files for caching
COPY package*.json package-lock.json ./

# Copy workspace package.json
COPY $WORKSPACE/package*.json ./$WORKSPACE/

# Install dependencies for the workspace
RUN npm install --workspace $WORKSPACE

# Copy workspace source
COPY $WORKSPACE ./ $WORKSPACE/

# Build workspace
RUN npm run build --workspace $WORKSPACE

# Runtime stage
FROM node:22-alpine
WORKDIR /app

COPY --from=0 /app/$WORKSPACE/dist ./dist
COPY --from=0 /app/$WORKSPACE/package*.json ./

RUN npm ci --omit=dev

EXPOSE 3000
CMD ["node", "dist/main.js"]
