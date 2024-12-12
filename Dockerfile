# Use Node.js base image with Python support
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Install Python and dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

# Install Python packages
RUN pip3 install --no-cache-dir netmiko pyyaml

# Create necessary directories
RUN mkdir -p /app/server/generated

# Copy package files first
COPY package*.json ./
RUN npm install

# Copy config files
COPY server/config ./server/config/
COPY server/config_loader.py ./server/

# Generate TypeScript configs
RUN python3 server/config_loader.py

# Copy remaining application files
COPY . .

# Build application
RUN npm run build

# Configure port
ENV PORT=5000
EXPOSE 5000

# Create startup script for config generation and server start
RUN echo '#!/bin/sh\n\
echo "Generating TypeScript configs..."\n\
cd /app\n\
mkdir -p /app/server/generated\n\
python3 /app/server/config_loader.py || exit 1\n\
echo "Starting server..."\n\
exec node /app/dist/index.js' > /app/start.sh && \
chmod +x /app/start.sh

# Start application with config generation
CMD ["/app/start.sh"]
