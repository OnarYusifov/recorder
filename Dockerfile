FROM node:22-alpine

# Install system dependencies for canvas
RUN apk add --no-cache \
    build-base \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    python3 \
    pkgconfig

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p /app/output /app/data /app/recordings

# Set permissions
RUN chmod -R 755 /app/output /app/data /app/recordings

# Expose web port
EXPOSE 8080

# Health check for web service
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/matches', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 0

# Default command (can be overridden)
CMD ["npm", "run", "bot1"]
