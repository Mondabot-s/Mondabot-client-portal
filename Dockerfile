# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy all package.json and package-lock.json files
COPY package*.json ./
COPY server/package*.json ./server/
COPY mondabot-dashboard/package*.json ./mondabot-dashboard/

# Install all dependencies for all workspaces
# Using 'npm ci' for faster, more reliable builds
RUN npm ci
RUN npm ci --prefix server
RUN npm ci --prefix mondabot-dashboard

# Copy the rest of the source code
COPY . .

# Run the Next.js build
# The build will happen in the 'mondabot-dashboard' subdirectory
RUN npm run build --prefix mondabot-dashboard


# Stage 2: Create the final production image
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV production
ENV RAILWAY_ENVIRONMENT production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy dependencies from the builder stage (only production deps)
# We copy the entire node_modules from the root, server, and dashboard
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/mondabot-dashboard/node_modules ./mondabot-dashboard/node_modules

# Copy the built Next.js application and the server code
COPY --from=builder /app/mondabot-dashboard ./mondabot-dashboard
COPY --from=builder /app/server ./server
COPY --from=builder /app/package.json ./package.json

# Change ownership of the files to the non-root user
USER nextjs

# Expose the port the server will run on (Railway will map this)
EXPOSE 3001

# The command to start the application
# This runs your Express server, which in turn serves the Next.js app
CMD ["node", "server/server.js"] 