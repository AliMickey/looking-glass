# Use Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install Python and required packages
RUN apk add --no-cache python3 py3-pip && \
    pip3 install --no-cache-dir netmiko pyyaml

# Copy application files
COPY . .

# Install dependencies and build
RUN npm install && \
    npm run build

# Configure port
ENV PORT=5000
EXPOSE 5000

# Start application
CMD ["node", "dist/index.js"]
