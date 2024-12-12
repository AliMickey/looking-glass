# Build stage
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
COPY client ./client
COPY server ./server
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY tsconfig.json ./
RUN npm install
RUN npm run build

# Final stage
FROM python:3.11-slim
WORKDIR /app

# Install Node.js and required tools
RUN apt-get update && \
    apt-get install -y curl wget && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install minimal Python packages
RUN pip install --no-cache-dir netmiko pyyaml

# Copy built assets and config
COPY --from=builder /app/dist ./dist
COPY server/config ./config

# Install production Node.js dependencies
COPY package*.json ./
RUN npm install --production

# Set permissions and user
RUN chown -R nobody:nogroup /app
USER nobody

# Configure port
ARG PORT=5000
ENV PORT=${PORT}
EXPOSE ${PORT}

# Start application
CMD ["node", "dist/index.js"]
