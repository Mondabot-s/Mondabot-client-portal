# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose ports
EXPOSE 3000 3001

# Set environment variables
ENV NODE_ENV=production
ENV RAILWAY_ENVIRONMENT=true

# Create start script
RUN echo '#!/bin/sh\n\
# Start backend server in background\n\
cd /app/server && npm start &\n\
BACKEND_PID=$!\n\
\n\
# Start frontend server\n\
cd /app && npm start &\n\
FRONTEND_PID=$!\n\
\n\
# Wait for both processes\n\
wait $BACKEND_PID $FRONTEND_PID' > /app/start.sh

RUN chmod +x /app/start.sh

# Start both servers
CMD ["/app/start.sh"] 