# Mondabot Dashboard - Complete Technical Documentation

> **Note for Development Team & AI Assistants:** This document is the single source of truth for the Mondabot Dashboard project. All significant changes, architectural decisions, and feature development should align with the guidelines specified herein. Please review relevant sections before starting new work.

> **Version**: 1.0.0  
> **Last Updated**: June 2025  
> **Author**: Development Team  

## Table of Contents

1. [System Overview](#system-overview)
2. [Brand Kit & Style Guide](#brand-kit--style-guide)
3. [Architecture](#architecture)
4. [Backend Server](#backend-server)
5. [Frontend Application](#frontend-application)
6. [Airtable Integration](#airtable-integration)
7. [Real-time Communication](#real-time-communication)
8. [Environment Configuration](#environment-configuration)
9. [Development Setup](#development-setup)
10. [Production Deployment](#production-deployment)
11. [API Reference](#api-reference)
12. [Troubleshooting](#troubleshooting)
13. [Maintenance & Monitoring](#maintenance--monitoring)

---

## System Overview

The **Mondabot Dashboard** is a full-stack web application that provides real-time project management capabilities with Airtable integration. It consists of a React/Next.js frontend and an Express.js backend that synchronizes data with Airtable bases.

### Key Features

- **Real-time Project Management**: Live updates via WebSocket connections
- **Airtable Integration**: Seamless synchronization with Airtable databases
- **Responsive Dashboard**: Modern UI built with Next.js and Tailwind CSS
- **Production-Ready**: Dockerized deployment with Railway hosting
- **Development-Friendly**: Hot-reload development environment

### Technology Stack

**Frontend:**
- Next.js 14+ (React framework)
- TypeScript (Type safety)
- Tailwind CSS (Styling)
- Socket.IO Client (Real-time communication)
- Axios (HTTP client)

**Backend:**
- Node.js 18+ (Runtime)
- Express.js 4.x (Web framework)
- Socket.IO (WebSocket server)
- Airtable SDK (Database integration)
- CORS (Cross-origin resource sharing)

**Infrastructure:**
- Docker (Containerization)
- Railway (Production hosting)
- GitHub (Version control & CI/CD)

---

## Brand Kit & Style Guide

This section outlines the visual identity of the Mondabot Dashboard, ensuring a consistent and professional user experience.

### Color Palette

The color scheme is designed to be modern, clean, and accessible.

| Role              | Hex Code  | Tailwind Class      | Description                               |
|-------------------|-----------|---------------------|-------------------------------------------|
| **Brand Primary** | `#170F3A` | `primary` / `brand-primary` | Main brand color for headers, logos, and key actions. |
| **Brand Secondary**| `#2D1B69` | `brand-secondary`   | Accent color for secondary elements.      |
| **Background**    | `#FFF9F9` | `background`        | Main page background color.               |
| **Content Area**  | `#FFFFFF` | `content-bg`        | Background for cards and content sections.|
| **Primary Text**  | `#1F2937` | `text-primary`      | For headings and primary content.         |
| **Secondary Text**| `#6B7280` | `text-secondary`    | For subheadings, labels, and descriptions.|
| **Icons**         | `#6B7280` | `icon-color`        | Default color for all UI icons.           |

#### Status Colors

Status colors provide immediate visual feedback on project states.

| Status      | Hex Code  | Tailwind Class        |
|-------------|-----------|-----------------------|
| **Building**  | `#EC4899` | `status-building`     |
| **Testing**   | `#007AFF` | `status-testing`      |
| **Review**    | `#FF6B35` | `status-review`       |
| **Live**      | `#34C759` | `status-live`         |

#### Grayscale Palette

A full grayscale palette is available for UI nuances, ranging from `gray-50` (`#F8FAFC`) to `gray-900` (`#0F172A`).

### Typography

- **Font Family**: `Poppins`, `sans-serif`
- **Usage**: The `Poppins` font should be used for all text content to maintain a consistent and modern look.

### Visual Elements

- **Shadows**:
  - `shadow-card`: `0 4px 6px rgba(0, 0, 0, 0.05)` - Standard card shadow.
  - `shadow-card-hover`: `0 8px 25px rgba(0, 0, 0, 0.1)` - Enhanced shadow on hover.
  - `shadow-premium`: `0 10px 40px rgba(23, 15, 58, 0.1)` - Used for prominent elements.

- **Animations**:
  - `slide-in`: A subtle slide-and-fade effect for appearing elements.
  - `fade-in`: A simple fade effect for new content.
  - `scale-in`: A scaling effect for modal dialogs or pop-ups.

---

## Architecture

### System Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │    Airtable     │
│   (Next.js)     │    │   (Express.js)   │    │     (API)       │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ React Pages │ │    │ │ REST API     │ │    │ │ Projects    │ │
│ │ Components  │ │    │ │ Endpoints    │ │    │ │ Table       │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ Custom      │ │◄──►│ │ Socket.IO    │ │    │ │ Tasks       │ │
│ │ Hooks       │ │    │ │ Server       │ │    │ │ Table       │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ Socket.IO   │ │    │ │ Airtable     │ │◄──►│ │ Webhooks    │ │
│ │ Client      │ │    │ │ SDK Client   │ │    │ │ (Optional)  │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Data Flow

1. **Frontend Request**: User interacts with React components
2. **API Call**: Frontend makes HTTP requests to Express backend
3. **Airtable Query**: Backend queries Airtable API using SDK
4. **Data Processing**: Backend processes and formats Airtable data
5. **Response**: Formatted data sent back to frontend
6. **Real-time Updates**: WebSocket broadcasts changes to all connected clients

---

## Backend Server

### Server Structure

The backend server (`server/server.js`) is built with Express.js and provides:

- **RESTful API endpoints** for data operations
- **WebSocket server** for real-time communication
- **Airtable integration** for data persistence
- **Static file serving** for production deployment
- **Comprehensive error handling** and logging

### Core Components

#### 1. Express Application Setup

```javascript
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(requestLogging);
```

#### 2. Airtable Client Initialization

```javascript
const base = new Airtable({ 
  apiKey: process.env.AIRTABLE_API_KEY,
  endpointUrl: 'https://api.airtable.com',
  requestTimeout: 30000
}).base(process.env.AIRTABLE_BASE_ID);
```

#### 3. Socket.IO Server Setup

```javascript
const io = socketIo(server, {
  cors: corsOptions,
  transports: ['polling', 'websocket'],
  allowEIO3: true
});
```

### Server Startup Process

1. **Environment Loading**: Loads `.env` file with configuration
2. **Dependency Check**: Verifies all required modules are available
3. **Airtable Connection**: Initializes Airtable client with credentials
4. **Socket.IO Setup**: Configures WebSocket server
5. **Route Registration**: Sets up all API endpoints
6. **Static File Serving**: Configures frontend file serving
7. **Server Start**: Binds to port and starts listening

### Error Handling Strategy

The server implements comprehensive error handling:

- **Graceful Degradation**: Server continues running even if Airtable fails
- **Detailed Logging**: All errors are logged with context
- **User-Friendly Messages**: API responses include helpful error messages
- **Fallback Mechanisms**: Dummy data provided when services are unavailable

---

## Frontend Application

### Application Structure

```
mondabot-dashboard/src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page
│   ├── dashboard/         # Dashboard pages
│   ├── tasks/            # Task management pages
│   └── test-page/        # Development testing pages
├── components/           # Reusable React components
│   ├── ServerStatus.tsx  # Connection status indicator
│   └── [other components]
├── hooks/               # Custom React hooks
│   ├── useProjects.ts   # Project data management
│   ├── useTasks.ts      # Task data management
│   └── useSocket.ts     # WebSocket connection
├── types/              # TypeScript type definitions
│   └── airtable.ts     # Airtable data types
└── lib/               # Utility functions
```

### Key Frontend Components

#### 1. Custom Hooks

**`useProjects.ts`**: Manages project data fetching and real-time updates
```typescript
export const useProjects = (): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { socket, connected: socketConnected } = useSocket();
  // ... implementation
};
```

**`useSocket.ts`**: Handles WebSocket connections with environment detection
```typescript
const getSocketUrl = (): string => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return window.location.origin; // Production
  }
  return 'http://localhost:3001'; // Development
};
```

#### 2. Server Status Component

Real-time connection monitoring with visual indicators:
- **Green**: All systems operational
- **Red**: Connection issues detected
- **Environment-aware**: Different messages for dev/prod

### State Management

The application uses React's built-in state management:

- **Local State**: Component-level state with `useState`
- **Custom Hooks**: Shared state logic across components
- **Context API**: Global state when needed
- **Real-time Updates**: WebSocket-driven state synchronization

---

## Airtable Integration

### Database Schema

The system integrates with two primary Airtable tables:

#### Projects Table (`tblJCWNtJPspIxcDC`)

| Field Name | Field ID | Type | Description |
|------------|----------|------|-------------|
| Project ID | `fldt2uqsBAs8iQlyL` | Text | Unique project identifier |
| Project Name | `fldV9xdwcDkMt9dNO` | Text | Display name |
| Status | `fld94mbrM8R9c8apl` | Select | Project status (Building, Live, Testing) |
| Deadline | `fld6BTXsUHNTWYlrv` | Date | Project deadline |
| Manager | `fldmBfIV2rtlr4ZWB` | Link | Assigned manager |
| Tasks | `fld5lb8nCSK4xBPo5` | Link | Related tasks |

#### Tasks Table (`tblTu01GpPvZM70Hw`)

| Field Name | Type | Description |
|------------|------|-------------|
| Task Name | Text | Task title |
| Status | Select | Task status |
| Project | Link | Related project |
| Assignee | Link | Task assignee |
| Due Date | Date | Task deadline |

### Data Synchronization Process

#### 1. Data Fetching

```javascript
// Fetch projects with error handling
const records = await base('Projects').select({
  maxRecords: 100,
  view: 'Grid view'
}).all();

// Transform Airtable records to application format
const projects = records.map(record => ({
  id: record.id,
  projectId: getField('Project ID', 'fldt2uqsBAs8iQlyL', ''),
  name: getField('Project Name', 'fldV9xdwcDkMt9dNO', 'Unnamed Project'),
  status: getField('Status', 'fld94mbrM8R9c8apl', 'Building'),
  // ... other fields
}));
```

#### 2. Field Mapping Strategy

The system uses a dual-mapping approach for robustness:

```javascript
const getField = (fieldName, fieldId, defaultValue = '') => {
  return record.get(fieldName) || record.get(fieldId) || defaultValue;
};
```

This ensures compatibility even if field names change in Airtable.

#### 3. Error Handling

Comprehensive error handling for Airtable operations:

- **401 Unauthorized**: Invalid API key
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Base or table doesn't exist
- **422 Unprocessable**: Invalid request format
- **429 Rate Limited**: Too many requests

### Webhook Integration (Optional)

The system supports Airtable webhooks for real-time updates:

```javascript
app.post('/api/webhooks/airtable-projects', (req, res) => {
  console.log('Received Airtable projects webhook:', req.body);
  
  // Broadcast update to all connected clients
  if (io) {
    io.emit('projects_updated', req.body);
  }
  
  res.status(200).json({ message: 'Webhook received successfully' });
});
```

---

## Real-time Communication

### WebSocket Architecture

The system uses Socket.IO for bidirectional real-time communication between frontend and backend.

#### Server-Side Implementation

```javascript
io.on('connection', (socket) => {
  console.log('✅ Socket.IO client connected:', socket.id);
  
  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket.IO client disconnected:', socket.id, 'Reason:', reason);
  });
});
```

#### Client-Side Implementation

```typescript
const socketConnection = io(socketUrl, {
  transports: ['polling', 'websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
});
```

### Real-time Events

| Event Name | Direction | Purpose |
|------------|-----------|---------|
| `connection` | Client → Server | Client connects |
| `disconnect` | Client → Server | Client disconnects |
| `projects_updated` | Server → Client | Project data changed |
| `task_updated` | Server → Client | Task data changed |

### Connection Management

The frontend automatically handles:

- **Connection establishment** with retry logic
- **Reconnection attempts** on network failures
- **Error handling** with user-friendly messages
- **Environment detection** for correct server URLs

---

## Environment Configuration

### Environment Variables

#### Backend Environment (`.env`)

```bash
# Required - Airtable Integration
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX    # Your Airtable Personal Access Token
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX    # Your Airtable Base ID

# Optional - Server Configuration
PORT=3001                              # Server port (Railway sets this automatically)
NODE_ENV=production                    # Environment mode
FRONTEND_URL=https://your-app.railway.app  # Frontend URL for CORS
```

#### Frontend Environment (Next.js)

Next.js automatically handles environment detection. No additional configuration needed for basic functionality.

### Configuration Hierarchy

1. **Environment Variables**: `.env` file or system environment
2. **Default Values**: Fallback values in code
3. **Runtime Detection**: Dynamic configuration based on environment

### Security Considerations

- **API Keys**: Never commit API keys to version control
- **Environment Files**: Use `.env` files for local development
- **Production Secrets**: Use Railway environment variables for production
- **CORS Configuration**: Restrict origins to known domains

---

## Development Setup

### Prerequisites

- **Node.js**: Version 18+ (LTS recommended)
- **npm**: Version 8+ (comes with Node.js)
- **Git**: For version control
- **Airtable Account**: With API access

### Local Development Setup

#### 1. Clone Repository

```bash
git clone https://github.com/your-username/mondabot-dashboard.git
cd mondabot-dashboard
```

#### 2. Install Dependencies

```bash
# Install workspace dependencies
npm install

# Install all project dependencies
npm run setup
```

#### 3. Configure Environment

```bash
# Copy environment template
cp server/.env.example server/.env

# Edit with your Airtable credentials
# AIRTABLE_API_KEY=your_api_key_here
# AIRTABLE_BASE_ID=your_base_id_here
```

#### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:server  # Backend only (port 3001)
npm run dev:next    # Frontend only (port 3000)
```

### Development Workflow

#### Available Scripts

```bash
# Development
npm run dev          # Start both servers
npm run dev:server   # Start backend only
npm run dev:next     # Start frontend only

# Production
npm run build        # Build frontend for production
npm run server       # Start production server

# Maintenance
npm run setup        # Install all dependencies
npm run clean        # Clean build artifacts
npm run fresh-install # Clean install from scratch

# Health Checks
npm run check-env    # Verify environment variables
npm run check-server # Test server connectivity
npm run health       # Full system health check
```

#### Development URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Debug Info**: http://localhost:3001/api/debug

### Code Structure Best Practices

#### Backend (`server/`)

```
server/
├── server.js          # Main server file
├── package.json       # Dependencies
├── .env              # Environment variables
├── .env.example      # Environment template
└── node_modules/     # Dependencies
```

#### Frontend (`mondabot-dashboard/`)

```
mondabot-dashboard/
├── src/
│   ├── app/          # Next.js pages
│   ├── components/   # Reusable components
│   ├── hooks/        # Custom hooks
│   ├── types/        # TypeScript types
│   └── lib/          # Utilities
├── public/           # Static assets
├── package.json      # Dependencies
└── next.config.ts    # Next.js configuration
```

---

## Production Deployment

### Railway Deployment

The application is configured for deployment on Railway with Docker.

#### Deployment Files

**`Dockerfile`**: Multi-stage build for optimized production image
```dockerfile
FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Build application
COPY . .
RUN cd mondabot-dashboard && npm run build

# Start server
CMD ["npm", "run", "server"]
```

**`railway.json`**: Railway-specific configuration
```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### Railway Configuration

**Environment Variables:**
```
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
NODE_ENV=production
```

**Build Settings:**
- Build Command: (empty - uses Dockerfile)
- Start Command: `npm run server`

#### Deployment Process

1. **Code Push**: Push changes to GitHub
2. **Automatic Build**: Railway detects changes and builds Docker image
3. **Deployment**: New image is deployed automatically
4. **Health Check**: Railway monitors application health

### Production Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Railway       │    │    Docker        │    │   Application   │
│   Platform      │    │   Container      │    │    Server       │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ Load        │ │    │ │ Node.js      │ │    │ │ Express.js  │ │
│ │ Balancer    │ │    │ │ Runtime      │ │    │ │ Server      │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ SSL         │ │    │ │ Next.js      │ │    │ │ Socket.IO   │ │
│ │ Termination │ │    │ │ Static Files │ │    │ │ Server      │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ Monitoring  │ │    │ │ Health       │ │    │ │ Airtable    │ │
│ │ & Logging   │ │    │ │ Checks       │ │    │ │ Client      │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Performance Optimization

#### Build Optimization

- **Multi-stage Docker build** for smaller images
- **Dependency pruning** after build
- **Static file optimization** with Next.js
- **Caching strategies** for faster builds

#### Runtime Optimization

- **Connection pooling** for Airtable requests
- **Error handling** to prevent crashes
- **Graceful shutdown** handling
- **Memory management** with proper cleanup

---

## API Reference

### Base URL

- **Development**: `http://localhost:3001`
- **Production**: `https://your-app-name.railway.app`

### Endpoints

#### Health & Status

**`GET /health`**
- **Purpose**: Server health check
- **Response**: Server status and configuration
- **Example**:
```json
{
  "status": "running",
  "timestamp": "2025-06-30T04:56:24.568Z",
  "uptime": 15.94,
  "environment": {
    "hasAirtableKey": true,
    "hasBaseId": true,
    "airtableReady": true,
    "socketIoReady": true
  }
}
```

**`GET /api/debug`**
- **Purpose**: Detailed system information
- **Response**: Environment, modules, and configuration details

#### Data Endpoints

**`GET /api/projects`**
- **Purpose**: Fetch all projects from Airtable
- **Response**: Array of project objects
- **Error Handling**: 503 if Airtable not configured, 500 for other errors
- **Example**:
```json
[
  {
    "id": "recXXXXXXXXXXXXXX",
    "projectId": "PROJ-001",
    "name": "Website Redesign",
    "status": "Building",
    "deadline": "2025-07-15",
    "assignedManager": ["Manager Name"],
    "tasks": ["Task 1", "Task 2"]
  }
]
```

**`GET /api/tasks`**
- **Purpose**: Fetch all tasks from Airtable
- **Response**: Array of task objects
- **Error Handling**: Similar to projects endpoint

**`GET /api/test-projects`**
- **Purpose**: Test endpoint with dummy data
- **Response**: Static test data for development

#### Webhook Endpoints

**`POST /api/webhooks/airtable-update`**
- **Purpose**: Receive task update webhooks from Airtable
- **Triggers**: `task_updated` WebSocket event

**`POST /api/webhooks/airtable-projects`**
- **Purpose**: Receive project update webhooks from Airtable
- **Triggers**: `projects_updated` WebSocket event

### Error Responses

All API endpoints return consistent error responses:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "statusCode": 400,
  "help": "Suggested solution"
}
```

### Rate Limiting

The system respects Airtable's rate limits:
- **5 requests per second** per base
- **Automatic retry** with exponential backoff
- **Error handling** for rate limit exceeded (429)

---

## Troubleshooting

### Common Issues

#### 1. Connection Refused Errors

**Symptoms**: `ERR_CONNECTION_REFUSED` or `xhr poll error`

**Causes**:
- Backend server not running
- Wrong port configuration
- Firewall blocking connections

**Solutions**:
```bash
# Check if server is running
netstat -an | findstr 3001

# Start backend server
cd server && npm start

# Check environment variables
npm run check-env
```

#### 2. Airtable API Errors

**Symptoms**: 401, 403, or 404 errors from Airtable

**Causes**:
- Invalid API key
- Wrong base ID
- Insufficient permissions

**Solutions**:
```bash
# Verify environment variables
cat server/.env

# Test API key manually
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.airtable.com/v0/YOUR_BASE_ID/Projects
```

#### 3. WebSocket Connection Issues

**Symptoms**: "WebSocket: Disconnected" status

**Causes**:
- Server not running
- CORS configuration issues
- Network connectivity problems

**Solutions**:
- Verify server is running on correct port
- Check CORS configuration in server
- Test WebSocket connection manually

#### 4. Build Failures

**Symptoms**: Docker build errors or deployment failures

**Causes**:
- Missing dependencies
- Environment variable issues
- Docker configuration problems

**Solutions**:
```bash
# Clean install
npm run fresh-install

# Test build locally
docker build -t test-app .
docker run -p 3001:3001 test-app
```

### Debugging Tools

#### 1. Health Check Endpoints

```bash
# Server health
curl http://localhost:3001/health

# Detailed debug info
curl http://localhost:3001/api/debug
```

#### 2. Log Analysis

**Server Logs**:
- Connection status
- Airtable request/response
- WebSocket events
- Error details

**Frontend Console**:
- API request/response
- WebSocket connection status
- Component state changes

#### 3. Network Debugging

```bash
# Check port usage
netstat -an | findstr 3001

# Test API endpoints
curl -v http://localhost:3001/api/projects

# WebSocket connection test
# Use browser developer tools WebSocket tab
```

### Performance Issues

#### 1. Slow API Responses

**Causes**:
- Large Airtable datasets
- Network latency
- Inefficient queries

**Solutions**:
- Implement pagination
- Add caching layer
- Optimize Airtable queries

#### 2. Memory Leaks

**Symptoms**: Increasing memory usage over time

**Causes**:
- Unclosed connections
- Event listener leaks
- Large object retention

**Solutions**:
- Monitor memory usage
- Implement proper cleanup
- Use connection pooling

---

## Maintenance & Monitoring

### Regular Maintenance Tasks

#### 1. Dependency Updates

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Security audit
npm audit
npm audit fix
```

#### 2. Environment Monitoring

```bash
# Check system health
npm run health

# Verify environment variables
npm run check-env

# Test server connectivity
npm run check-server
```

#### 3. Log Rotation

- Monitor log file sizes
- Implement log rotation policies
- Archive old logs

### Monitoring Setup

#### 1. Health Checks

Railway automatically monitors:
- **HTTP health checks** (`/health` endpoint)
- **Application uptime**
- **Resource usage**
- **Error rates**

#### 2. Custom Monitoring

Implement custom monitoring for:
- **Airtable API response times**
- **WebSocket connection counts**
- **Error frequencies**
- **Data synchronization status**

#### 3. Alerting

Set up alerts for:
- **Service downtime**
- **High error rates**
- **Airtable API failures**
- **Memory/CPU usage spikes**

### Backup & Recovery

#### 1. Data Backup

- **Airtable**: Native backup features
- **Configuration**: Environment variables backup
- **Code**: Git repository as backup

#### 2. Disaster Recovery

**Recovery Procedures**:
1. **Service Restoration**: Redeploy from Git
2. **Configuration Recovery**: Restore environment variables
3. **Data Recovery**: Restore from Airtable backups
4. **Verification**: Run health checks

### Performance Monitoring

#### 1. Key Metrics

- **Response Times**: API endpoint performance
- **Error Rates**: Success/failure ratios
- **Connection Counts**: WebSocket connections
- **Resource Usage**: CPU, memory, network

#### 2. Optimization Strategies

- **Caching**: Implement Redis for frequently accessed data
- **CDN**: Use CDN for static assets
- **Database Optimization**: Optimize Airtable queries
- **Code Splitting**: Implement lazy loading

---

## Conclusion

This documentation provides a comprehensive reference for the Mondabot Dashboard system. It covers all aspects from development setup to production deployment and maintenance.

### Key Takeaways

1. **Modular Architecture**: Clean separation between frontend and backend
2. **Real-time Capabilities**: WebSocket integration for live updates
3. **Production Ready**: Docker containerization and Railway deployment
4. **Developer Friendly**: Comprehensive tooling and documentation
5. **Scalable Design**: Architecture supports future enhancements

### Next Steps

- **Feature Enhancements**: Add new functionality as needed
- **Performance Optimization**: Implement caching and optimization
- **Monitoring Improvements**: Add comprehensive monitoring
- **Security Hardening**: Implement additional security measures

### Support & Resources

- **Repository**: GitHub repository with latest code
- **Documentation**: This document and inline code comments
- **Railway Dashboard**: Production monitoring and logs
- **Airtable Documentation**: API reference and guides

---

*This documentation is maintained by the development team and should be updated with any significant changes to the system.* 