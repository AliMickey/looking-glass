FROM node:20-bullseye-slim AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first to leverage Docker cache
COPY app/package*.json ./

# Install dependencies with exact versions
RUN npm ci

# Copy the rest of the application code
COPY app/ ./

# Build TypeScript application (both client and server)
RUN npm run build

# Production image
FROM node:20-bullseye-slim

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Set working directory
WORKDIR /app

# Copy only the built artifacts and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy static assets if any
COPY --from=builder /app/client/public ./dist/client/public

# Set permissions
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Set production environment and external access
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=5000

# Expose port
EXPOSE 5000

# Health check with proper timeout and interval
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Start application with proper signal handling
CMD ["node", "--unhandled-rejections=strict", "./dist/server/index.js"]
