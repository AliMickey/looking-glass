FROM node:20-bullseye

WORKDIR /app

# Combine apt-get and pip installations into a single layer
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install --no-cache-dir netmiko pyyaml && \
    rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files and build
COPY . .
RUN python3 server/config_loader.py && \
    npm run build

ENV PORT=5000
EXPOSE $PORT

CMD ["sh", "-c", "python3 /app/server/config_loader.py && node /app/dist/index.js"]