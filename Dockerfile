# Multi-stage build for production
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY server/package*.json ./server/
COPY mondabot-dashboard/package*.json ./mondabot-dashboard/
RUN npm ci --only=production
RUN cd server && npm ci --only=production
RUN cd mondabot-dashboard && npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY server/package*.json ./server/
COPY mondabot-dashboard/package*.json ./mondabot-dashboard/
RUN npm ci
RUN cd server && npm ci
RUN cd mondabot-dashboard && npm ci
COPY . .
RUN cd mondabot-dashboard && npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV RAILWAY_ENVIRONMENT production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/mondabot-dashboard/public ./mondabot-dashboard/public
COPY --from=builder /app/mondabot-dashboard/.next/standalone ./mondabot-dashboard/.next/standalone
COPY --from=builder /app/mondabot-dashboard/.next/static ./mondabot-dashboard/.next/static
COPY --from=builder /app/server ./server
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules

# Copy start script
COPY --from=builder /app/scripts ./scripts

USER nextjs

EXPOSE 3001

CMD ["node", "scripts/start-production.js"] 