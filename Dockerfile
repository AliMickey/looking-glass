# Build stage
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
COPY client ./client
COPY server ./server
COPY db ./db
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY tsconfig.json ./
COPY drizzle.config.ts ./
RUN npm install
RUN npm run build

# Final stage
FROM python:3.11-slim
WORKDIR /app

# Install Node.js
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy Python requirements
COPY pyproject.toml ./
RUN pip install netmiko pyyaml

# Copy built assets
COPY --from=builder /app/dist ./dist
COPY server/config ./config

# Install production dependencies
COPY package*.json ./
RUN npm install --production

# Install Python dependencies from pyproject.toml
COPY pyproject.toml ./
RUN pip install -e .

# Set permissions for the app directory
RUN chown -R nobody:nogroup /app

# Switch to non-root user
USER nobody

ARG PORT=5000
ENV PORT=${PORT}
EXPOSE ${PORT}
CMD ["node", "dist/index.js"]
