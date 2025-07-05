# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory. This is the root directory of the project.
WORKDIR /app

# Set build-time environment variables for Next.js prerendering
# Note: NOT setting NODE_ENV=production here to allow devDependencies installation
ENV NEXT_PUBLIC_ENABLE_AUTHENTICATION=true
# Add build args for Clerk keys that will be passed from Railway
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
# Set them as environment variables for the build
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

# Copy all package.json and package-lock.json files
COPY package*.json ./
COPY server/package*.json ./server/
COPY mondabot-dashboard/package*.json ./mondabot-dashboard/

# Install dependencies in the correct order
# Install both dependencies and devDependencies for build process
# First install root dependencies (includes next, react, etc.)
RUN npm install --include=dev

# Then install server dependencies
RUN npm install --prefix server --include=dev

# Finally install frontend dependencies (including tailwindcss as devDependency)
RUN npm install --prefix mondabot-dashboard --include=dev

# Copy the rest of the source code
COPY . .

# Build the Next.js application (this needs devDependencies like tailwindcss)
RUN cd mondabot-dashboard && npm run build

# Stage 2: Create the final production image
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment to production for runtime
ENV NODE_ENV=production
ENV RAILWAY_ENVIRONMENT=production
ENV NEXT_PUBLIC_ENABLE_AUTHENTICATION=true

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