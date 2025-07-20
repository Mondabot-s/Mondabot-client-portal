# CLAUDE.md - Mondabot Dashboard Project Documentation

## 🚨 CRITICAL: Read .cursorrules First!
**MANDATORY:** Before making ANY changes to this codebase, read and understand `.cursorrules` completely. It contains critical architecture protection rules that must be followed to prevent breaking the application.

## 🏗️ Project Architecture Overview

### System Architecture
The Mondabot Dashboard is a **dual-server microservices architecture** designed for scalability and maintainability:

- **Frontend**: Next.js 15.3.4 application with React 19 and TypeScript
- **Backend**: Express.js server with Airtable integration and Socket.IO
- **Database**: Airtable as primary data source
- **Authentication**: Clerk.js integration (optional/conditional)
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Railway platform with Docker containerization

### Port Configuration
- **Port 3000**: Frontend (Next.js) - ALWAYS test frontend changes here
- **Port 3001**: Backend (Express.js API) - Backend only, never test frontend here
- **Architecture Rule**: NEVER merge into single port - this is intentional separation

## 🔧 Technology Stack

### Frontend Dependencies
```json
{
  "next": "15.3.4",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5",
  "tailwindcss": "^3.4.1",
  "@clerk/nextjs": "^5.0.0",
  "socket.io-client": "^4.8.1",
  "axios": "^1.10.0",
  "lucide-react": "^0.522.0",
  "@fortawesome/fontawesome-free": "^6.7.2"
}
```

### Backend Dependencies
```json
{
  "express": "^4.19.2",
  "socket.io": "^4.8.1",
  "airtable": "^0.12.2",
  "cors": "^2.8.5",
  "dotenv": "^17.0.0",
  "nodemon": "^3.0.1"
}
```

### Development Tools
- **TypeScript**: Strict mode enabled with Next.js optimizations
- **ESLint**: Next.js, React, and TypeScript rules
- **Tailwind CSS**: Custom design system with Poppins font
- **Concurrently**: Dual-server development workflow
- **PowerShell Scripts**: Windows-optimized development tools

## 🚫 FORBIDDEN PRACTICES (From .cursorrules)

### NEVER DO:
1. **Static Export**: `output: 'export'` breaks Socket.IO and real-time features
2. **Standalone Mode**: `output: 'standalone'` conflicts with Express integration
3. **Port Merging**: DO NOT suggest single-port architecture
4. **Backend Removal**: NEVER remove Express server or move to Next.js API routes
5. **React Hooks in try-catch**: Violates React Hooks rules - causes build failures
6. **Multiple Clerk redirects**: Use only `forceRedirectUrl` and `fallbackRedirectUrl`

### ALWAYS DO:
1. **Preserve dual-server architecture** - it's professional and scalable
2. **Call React hooks at top level** - never conditionally
3. **Test on localhost:3000** - never test frontend on 3001
4. **Fix deployment config** - never change architecture for deployment issues
5. **Handle errors in useEffect** - not around hook calls

## 📁 Project Structure

```
mondabot-dashboard/
├── .cursorrules                    # 🔴 CRITICAL: Architecture protection rules
├── package.json                    # Root workspace configuration
├── scripts/                        # Development and deployment utilities
│   ├── start-dev.ps1              # Windows development startup
│   ├── start-dev.js               # Cross-platform development
│   ├── start-production.js        # Production server management
│   └── test-deployment.js         # Health check validation
├── server/                         # 🔵 Express.js Backend
│   ├── server.js                  # Main Express server with Socket.IO
│   ├── package.json               # Backend dependencies
│   └── .env                       # Airtable and server configuration
└── mondabot-dashboard/             # 🟢 Next.js Frontend
    ├── src/
    │   ├── app/                   # Next.js App Router
    │   │   ├── layout.tsx         # Root layout with ClerkProvider
    │   │   ├── page.tsx           # Dashboard home
    │   │   ├── tasks/page.tsx     # Kanban task management
    │   │   ├── automations/page.tsx # Projects overview
    │   │   ├── login/[[...rest]]/ # Clerk authentication
    │   │   └── api/               # API route proxies
    │   ├── components/            # Reusable UI components
    │   │   ├── Layout.tsx         # Main layout wrapper
    │   │   ├── Sidebar.jsx        # Navigation sidebar
    │   │   └── DevHealthCheck.tsx # Development status monitor
    │   ├── hooks/                 # Custom React hooks
    │   │   ├── useProjects.ts     # Projects data with WebSocket
    │   │   ├── useTasks.ts        # Tasks data with real-time updates
    │   │   └── useSocket.ts       # Socket.IO client management
    │   ├── types/                 # TypeScript interfaces
    │   │   └── airtable.ts        # Airtable data models
    │   └── ui/                    # Design system components
    ├── next.config.ts             # API proxy configuration
    ├── tailwind.config.ts         # Custom design system
    └── package.json               # Frontend dependencies
```

## 🔐 Authentication Implementation

### Clerk.js Integration (Optional)
The application supports **conditional authentication** that can be enabled or disabled:

```typescript
// Environment-based authentication
const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTHENTICATION === 'true';
const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
```

### Middleware Protection (`src/middleware.ts`)
```typescript
// Smart route protection
const shouldProtect = isAuthEnabled && 
                     isClerkConfigured &&
                     !isPublicRoute(req) && 
                     isProtectedRoute(req);
```

### Protected Routes
- `/` (Dashboard home)
- `/dashboard(.*)` 
- `/automations(.*)` (Projects)
- `/tasks(.*)` (Kanban board)
- `/referrals(.*)` 
- `/updates(.*)` 
- `/api(.*)` (API routes)

### Public Routes
- `/login(.*)` 
- `/signup(.*)` 
- `/sign-in(.*)` 
- `/sign-up(.*)` 
- `/verify-email-address(.*)` 
- `/factor-one(.*)` 

### Clerk Configuration (Root Layout)
```typescript
<ClerkProvider
  publishableKey={publishableKey}
  signInUrl="/login"
  signUpUrl="/signup"
  afterSignInUrl="/dashboard"
  afterSignUpUrl="/dashboard"
  signInFallbackRedirectUrl="/dashboard"
  signUpFallbackRedirectUrl="/dashboard"
>
```

## 🗄️ Data Layer Architecture

### Airtable Integration
Primary data source with dual-field access pattern for robustness:

```javascript
// Field mapping with fallback (server/server.js)
const getField = (fieldName, fieldId, defaultValue = '') => {
  return record.get(fieldName) || record.get(fieldId) || defaultValue;
};
```

### TypeScript Data Models (`src/types/airtable.ts`)
```typescript
export interface Project {
  id: string;
  projectId: string;
  name: string;
  status: 'Building' | 'Live' | 'Testing';
  deadline: string | null;
  assignedManager: string[];
  tasks: Task[];
}

export interface Task {
  id: string;
  taskId: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
}
```

### Custom Data Hooks
- **`useProjects.ts`**: Projects with real-time updates via Socket.IO
- **`useTasks.ts`**: Tasks with optimistic UI updates and WebSocket sync
- **`useSocket.ts`**: Socket.IO connection management with auto-reconnect

### Real-time Updates
Socket.IO events for live data synchronization:
- `projects_updated`: Triggers project data refetch
- `task_updated`: Updates individual task state
- Connection management with fallback to polling transport

## 🎨 Design System

### Tailwind Configuration
Custom design system with brand colors and typography:

```css
:root {
  --color-primary: #170F3A;      /* Brand purple */
  --color-secondary: #CC1175;    /* Brand pink */
  --color-accent: #0084FF;       /* Blue accent */
  --font-family: 'Poppins', sans-serif;
}
```

### Status Color System (`src/utils/statusTheme.ts`)
- **Building**: Pink (#CC1175)
- **Testing**: Blue (#0084FF) 
- **Review**: Orange (#FF8C00)
- **Live**: Green (#10B981)

### Component Library (`src/ui/`)
- **Card.tsx**: Reusable card component with consistent styling
- **Icon.tsx**: Lucide React icon wrapper with size variants
- **ProgressBar.tsx**: Animated progress indicator

### Typography
- **Font**: Poppins (Google Fonts) with weights 400, 500, 600, 700
- **Icons**: FontAwesome Free + Lucide React for modern icons

## 🔄 Development Workflow

### Starting Development (Cross-platform)
```bash
# Root directory - starts both servers
npm run dev

# Windows PowerShell (recommended)
npm run dev:windows

# Force restart (kills existing processes)
npm run dev:windows:force

# Clean install and restart
npm run dev:windows:clean
```

### Manual Server Management
```bash
# Backend only (port 3001)
npm run dev:backend

# Frontend only (port 3000) 
npm run dev:frontend

# Health check
npm run health
```

### PowerShell Development Script (`scripts/start-dev.ps1`)
Features:
- **Port conflict detection** and optional process termination
- **Dependency validation** with automatic installation
- **Environment validation** for Airtable credentials
- **Clean installation** option with full reset
- **Dual-window startup** with color-coded output (blue=backend, green=frontend)

### Environment Setup
Required environment variables in `server/.env`:
```env
AIRTABLE_API_KEY=pat_xxxxxxxxxxxxxxxxxx
AIRTABLE_BASE_ID=appYNr1T9N3F7sm81
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Optional Clerk Authentication
NEXT_PUBLIC_ENABLE_AUTHENTICATION=true
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

## 🚀 Deployment Architecture

### Railway Platform
Dual deployment strategy with Docker containerization:

#### Production Configuration (`railway.json`)
```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "npm run railway:start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### Docker Multi-stage Build (`Dockerfile`)
1. **Builder Stage**: Installs dependencies and builds Next.js
2. **Production Stage**: Optimized runtime with non-root user

### Production Startup (`scripts/start-production.js`)
**Railway Mode**: Single unified server serving both API and Next.js
- Express serves Next.js static build
- Health checks on `/health` endpoint
- Environment-specific CORS configuration

### Health Monitoring
Multi-level health checks:
- **Docker**: HTTP health check on port 3001
- **Railway**: Health endpoint with 300s timeout
- **Application**: Comprehensive status including Airtable connectivity

## 🔧 API Architecture

### Express.js Backend (`server/server.js`)

#### Core Endpoints
- **GET `/health`**: Comprehensive server health status
- **GET `/api/health`**: Simple API health check
- **GET `/api/projects`**: Fetch all projects from Airtable
- **GET `/api/tasks`**: Fetch all tasks from Airtable
- **POST `/api/webhooks/airtable-*`**: Real-time update webhooks

#### Airtable Integration Pattern
```javascript
// Dual table access (name vs ID for robustness)
try {
  records = await base('Projects').select(selectOptions).all();
} catch (nameError) {
  if (nameError.statusCode === 404) {
    records = await base('tblJCWNtJPspIxcDC').select(selectOptions).all();
  }
}
```

#### Error Handling Strategy
- **Graceful degradation**: Server continues if Airtable fails
- **Detailed logging**: Comprehensive error information for debugging
- **User-friendly messages**: Clear error responses for frontend
- **Fallback data**: Dummy data when services unavailable

### Next.js API Proxy (`next.config.ts`)
```typescript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: process.env.NODE_ENV === 'production'
        ? 'http://localhost:3001/api/:path*'  // Production
        : 'http://localhost:3001/api/:path*', // Development
    },
  ];
}
```

## 🧪 Testing and Quality Assurance

### Health Check Scripts
- **`scripts/test-deployment.js`**: Validates deployment readiness
- **`scripts/check-server.js`**: Backend server health verification
- **`scripts/verify-setup.ps1`**: Pre-development validation

### Development Health Monitor (`src/components/DevHealthCheck.tsx`)
Real-time status monitoring during development:
- Backend connectivity check every 10 seconds
- Visual status indicators
- Port validation
- Automatic health endpoint testing

### Build Validation
```bash
# Local build test
cd mondabot-dashboard && npm run build

# Production simulation
npm run test-production

# Railway build test
npm run test-railway
```

## 🛡️ Security Considerations

### Environment Security
- API keys in `.env` files (never committed)
- Environment-based feature flags
- CORS properly configured for development/production
- No sensitive data in client-side code

### Authentication Security
- Clerk handles all auth logic securely
- JWT tokens managed server-side
- Protected routes with proper middleware
- Graceful fallback when auth disabled

### Production Security
- Non-root Docker user (`nextjs:nodejs`)
- Security headers configured
- HTTPS enforced in production
- Rate limiting considerations

## 📊 Performance Optimizations

### Frontend Performance
- **React 19**: Latest performance optimizations
- **Next.js 15**: Improved App Router and bundling
- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js built-in optimizations
- **Font Optimization**: Google Fonts with variable weights

### Backend Performance
- **Connection Pooling**: Airtable client reuse
- **Request Timeouts**: 30-second Airtable timeout
- **Socket.IO Optimization**: Polling → WebSocket upgrade
- **Error Caching**: Prevents repeated failed requests

### Real-time Performance
- **WebSocket Fallback**: Graceful degradation to polling
- **Optimistic Updates**: Immediate UI feedback
- **Selective Refetching**: Only updated data refreshed
- **Connection Management**: Automatic reconnection

## 🔍 Troubleshooting Guide

### Common Issues

#### "Build fails with React Hooks error"
**Cause**: Hooks called conditionally or in try-catch blocks
**Solution**: Move all hooks to component top level, handle errors in useEffect

#### "Users stuck on login page after authentication"
**Cause**: Multiple conflicting Clerk redirect props
**Solution**: Use only `forceRedirectUrl` and `fallbackRedirectUrl`

#### "Changes don't show on localhost:3001"
**Cause**: Testing frontend on backend port
**Solution**: Always test frontend changes on localhost:3000

#### "API routes not working"
**Cause**: Backend server not running or proxy misconfigured
**Solution**: Ensure both servers running, check proxy in next.config.ts

#### "PowerShell command errors with &&"
**Cause**: PowerShell doesn't support && operator
**Solution**: Use semicolon (;) or separate commands

### Debug Commands
```bash
# Check port usage
npm run check-ports

# Validate environment
npm run check-env

# Test health endpoints
curl http://localhost:3001/health
curl http://localhost:3000/api/health

# Build test
cd mondabot-dashboard && npm run build
```

## 🏃‍♂️ Quick Start Commands

### First Time Setup
```bash
# Install all dependencies
npm run setup

# Start development (recommended)
npm run dev:windows

# Or cross-platform
npm run dev
```

### Daily Development
```bash
# Normal startup
npm run dev

# If ports occupied
npm run dev:windows:force

# Clean installation (if issues)
npm run fresh-install
```

### Production Testing
```bash
# Test production locally
npm run test-production

# Validate Railway build
npm run test-railway
```

## 📋 Pre-commit Checklist

Before committing changes:
- ✅ Build succeeds locally (`npm run build`)
- ✅ Both servers start correctly (`npm run dev`)
- ✅ Health checks pass (`npm run health`)
- ✅ Test on localhost:3000 (not 3001)
- ✅ No React Hooks rule violations
- ✅ Authentication flow works if enabled
- ✅ Real-time features functional

## 🚨 Emergency Contacts

If you need to override these guidelines:
1. **Explain why current architecture is superior**
2. **Show how changes would break existing functionality**
3. **Reference specific solved issues**
4. **Offer alternative solutions that preserve architecture**
5. **Only implement if user explicitly accepts trade-offs**

## 📚 Additional Documentation

- **DEPLOYMENT_GUIDE.md**: Railway-specific deployment instructions
- **TROUBLESHOOTING.md**: Detailed error resolution
- **README.md**: User-facing setup instructions
- **.cursorrules**: Critical architecture protection rules

---

**Remember**: This architecture is intentionally sophisticated and follows industry best practices. The dual-server setup, authentication flow, and build configuration are the result of solving real-world problems. Protect this architecture at all costs!