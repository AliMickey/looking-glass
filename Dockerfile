FROM node:20-bullseye-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY app/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY app/ ./

# Build TypeScript application
RUN npm run build

# Production image
FROM node:20-bullseye-slim

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Set working directory
WORKDIR /app

# Copy built artifacts and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Set permissions
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Set production environment
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=5000

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "./dist/server/index.js"]
