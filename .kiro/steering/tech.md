# Technology Stack & Build System

## Core Technologies

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Real-time**: Socket.IO Client
- **HTTP Client**: Axios
- **Data Fetching**: SWR

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Real-time**: Socket.IO Server
- **Database**: Airtable SDK
- **CORS**: Express CORS middleware

### Infrastructure
- **Containerization**: Docker
- **Hosting**: Railway
- **Version Control**: Git/GitHub

## Environment Setup

### Required Environment Variables

#### Backend (.env in server directory)
```
# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env.local in mondabot-dashboard directory)
```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Application Configuration
NEXT_PUBLIC_ENABLE_AUTHENTICATION=true
```

## Common Commands

### Development
```bash
# Install all dependencies
npm run setup

# Start both frontend and backend servers
npm run dev

# Start frontend only
npm run frontend
# or
cd mondabot-dashboard && npm run dev

# Start backend only
npm run backend
# or
cd server && npm run dev

# Windows-specific development start
npm run dev:windows
```

### Building & Testing
```bash
# Build frontend for production
npm run build
# or
cd mondabot-dashboard && npm run build

# Test production build locally
npm run test-production

# Check environment variables
npm run check-env

# Check server health
npm run check-server

# Full health check
npm run health
```

### Deployment
```bash
# Railway build process
npm run railway:build

# Railway start command
npm run railway:start

# Test Railway build locally
npm run test-railway
```

### Maintenance
```bash
# Clean build artifacts
npm run clean

# Fresh install of all dependencies
npm run fresh-install
# or
npm run reset

# Check port usage (Windows)
npm run check-ports
```

## Development Guidelines

- Use TypeScript for type safety
- Follow React hooks rules strictly
- Use SWR for data fetching with proper caching
- Implement proper error handling for API calls
- Use Socket.IO for real-time communication
- Follow the established project structure
- Use environment variables for configuration
- Test builds locally before deployment