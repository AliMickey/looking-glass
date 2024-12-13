# Build stage
FROM node:20-slim AS builder

# Install necessary build tools and dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first for better layer caching
COPY app/package*.json ./

# Install all dependencies with specific version of npm
RUN npm install -g npm@10.2.4 && \
    npm ci

# Copy application code
COPY app/ ./
COPY config/ /config/

# Build application
RUN npm run build

# Production stage
FROM node:20-slim AS runner

# Install production system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    dumb-init \
    curl && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r photoglass && \
    useradd -r -g photoglass -s /bin/false photoglass && \
    mkdir -p /app /config && \
    chown photoglass:photoglass /app /config

WORKDIR /app

# Copy only production necessary files
COPY --from=builder --chown=photoglass:photoglass /app/dist ./dist
COPY --from=builder --chown=photoglass:photoglass /app/package*.json ./
COPY --from=builder --chown=photoglass:photoglass /config /config

# Install production dependencies only
ENV NODE_ENV=production
RUN npm ci --only=production && \
    npm cache clean --force

# Switch to non-root user
USER photoglass

# Set production environment and configuration
ENV HOST=0.0.0.0 \
    PORT=3000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Expose application port
EXPOSE 3000

# Use dumb-init as PID 1
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start application
CMD ["npm", "run", "start"]
