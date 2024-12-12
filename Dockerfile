# Build stage
FROM node:20-bullseye-slim as build
WORKDIR /app
COPY app/package*.json ./
RUN npm install
COPY app .
RUN npm run build

# Production stage
FROM node:20-bullseye-slim
# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY app/package*.json ./
RUN npm ci --only=production && chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Set production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "dist/index.js"]
