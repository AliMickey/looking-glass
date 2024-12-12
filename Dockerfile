# Build stage
FROM node:20-bullseye AS builder

WORKDIR /app

# Install Python and required packages
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install pyyaml && \
    rm -rf /var/lib/apt/lists/*

# Copy package files first to leverage cache
COPY app/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY app .

# Build application
RUN npm run build

# Production stage
FROM node:20-bullseye-slim

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Install Python and required packages
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install pyyaml && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy configuration files
COPY config ./config

# Set proper permissions
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Set production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:5000/health || exit 1

# Start application
CMD ["sh", "-c", "python3 server/config_loader.py && node dist/index.js"]