FROM node:20-bullseye-slim

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Copy app files
COPY app/package*.json ./
RUN npm ci --only=production

COPY app .
RUN npm run build && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Set production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "dist/index.js"]