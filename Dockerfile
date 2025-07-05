# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package files for dependency installation
COPY package*.json ./
COPY mondabot-dashboard/package*.json ./mondabot-dashboard/
COPY server/package*.json ./server/

# Install ALL dependencies (including devDependencies for building)
RUN npm install
RUN cd mondabot-dashboard && npm install
RUN cd server && npm install --production

# Copy source code
COPY . .

# Build the Next.js frontend with standalone output
RUN cd mondabot-dashboard && npm run build

# Remove devDependencies after build to reduce image size
RUN cd mondabot-dashboard && npm prune --production

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory to the nodejs user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose ports for both services
EXPOSE 3000 3001

# Health check - check the Express backend health endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Set environment variables for production
ENV NODE_ENV=production
ENV RAILWAY_ENVIRONMENT=true

# Start both services using the Railway start command
CMD ["npm", "run", "railway:start"] 