# Stage 1: Build client
FROM node:20-alpine AS client-builder
WORKDIR /app
COPY app/client/package*.json ./client/
WORKDIR /app/client
RUN npm ci
COPY app/client/ ./
RUN npm run build

# Stage 2: Build server
FROM node:20-alpine AS server-builder
WORKDIR /app
COPY app/server/package*.json ./server/
WORKDIR /app/server
RUN npm ci
COPY app/server/ ./
RUN npm run build

# Stage 3: Production environment
FROM python:3.11-slim

# Install Node.js in production image
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Python requirements and install dependencies
COPY pyproject.toml uv.lock ./
RUN pip install --no-cache-dir netmiko pyyaml

# Copy built client files
COPY --from=client-builder /app/client/dist ./client/dist

# Copy server files and install production dependencies
COPY --from=server-builder /app/server/dist ./server/dist
COPY app/server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production

# Copy configuration files
COPY config ./config
COPY assets ./assets

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# Create a non-root user
RUN useradd -m -u 1001 appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server/dist/index.js"]
