# Build stage
FROM node:20-slim AS builder
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .
RUN npm run build

# Production stage
FROM node:20-slim
WORKDIR /app

# Copy built assets and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Create config directory for host mapping
RUN mkdir -p /app/config

# Expose port
EXPOSE 8080

# Set production environment
ENV NODE_ENV=production \
    PORT=8080 \
    HOST=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/health || exit 1

# Start the application
CMD ["npm", "start"]
