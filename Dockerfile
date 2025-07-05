# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy all package.json and package-lock.json files
COPY package*.json ./
COPY server/package*.json ./server/
COPY mondabot-dashboard/package*.json ./mondabot-dashboard/

# Install dependencies in the correct order
# Use npm install instead of npm ci to handle potential lock file sync issues
# First install root dependencies (includes next, react, etc.)
RUN npm install

# Then install server dependencies (includes next dependency)
RUN npm install --prefix server

# Finally install frontend dependencies
RUN npm install --prefix mondabot-dashboard

# Copy the rest of the source code
COPY . .

# Build the Next.js application
RUN cd mondabot-dashboard && npm run build

# Stage 2: Create the final production image
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV RAILWAY_ENVIRONMENT=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy package.json files first
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server/package.json ./server/package.json
COPY --from=builder /app/mondabot-dashboard/package.json ./mondabot-dashboard/package.json

# Copy node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/mondabot-dashboard/node_modules ./mondabot-dashboard/node_modules

# Copy the built Next.js application
COPY --from=builder /app/mondabot-dashboard/.next ./mondabot-dashboard/.next
COPY --from=builder /app/mondabot-dashboard/public ./mondabot-dashboard/public
COPY --from=builder /app/mondabot-dashboard/next.config.ts ./mondabot-dashboard/next.config.ts

# Copy server code and scripts
COPY --from=builder /app/server ./server
COPY --from=builder /app/scripts ./scripts

# Change ownership of the files to the non-root user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose the port the server will run on (Railway will map this)
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { \
    if (res.statusCode === 200) { console.log('Health check passed'); process.exit(0); } \
    else { console.log('Health check failed'); process.exit(1); } \
  }).on('error', () => { console.log('Health check error'); process.exit(1); });"

# The command to start the application using the production start script
CMD ["npm", "run", "railway:start"] 