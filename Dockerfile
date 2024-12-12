FROM node:20-bullseye-slim

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Set working directory
WORKDIR /app

# Copy package files
COPY app/package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY app/ ./

# Build application and set permissions
RUN npm run build && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Set production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "./dist/index.js"]
