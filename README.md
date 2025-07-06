# Mondabot Dashboard

A professional full-stack application built with Next.js 15 and Express.js, featuring real-time functionality, Airtable integration, and Clerk authentication.

## 🏗️ Architecture Overview

### Dual-Server Architecture
This project uses a **professional dual-server architecture** that separates concerns and provides scalability:

- **Frontend**: Next.js 15 with App Router (Port 3000)
- **Backend**: Express.js with Socket.IO (Port 3001)
- **Database**: Airtable integration
- **Authentication**: Clerk
- **Real-time**: Socket.IO for live updates

### Why Dual-Server Architecture?

✅ **Separation of Concerns**: Frontend and backend can evolve independently  
✅ **Scalability**: Services can be scaled independently in production  
✅ **Professional Pattern**: Industry-standard microservices-ready architecture  
✅ **Development Flexibility**: Multiple frontends can use the same backend  
✅ **Real-time Capabilities**: Dedicated Express server for Socket.IO  

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Mondabot-s/Mondabot-client-portal.git
cd Mondabot-client-portal
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
npm install --prefix server

# Install frontend dependencies
npm install --prefix mondabot-dashboard
```

### 3. Environment Setup

Create environment files:

#### Root `.env`:
```env
# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id

# Server Configuration
PORT=3001
NODE_ENV=development
```

#### Frontend `.env.local` (mondabot-dashboard/.env.local):
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Application Configuration
NEXT_PUBLIC_ENABLE_AUTHENTICATION=true
```

#### Backend `.env` (server/.env):
```env
# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 4. Development Server

```bash
# Start both servers simultaneously
npm run dev

# Or start individually:
# Frontend: npm run frontend
# Backend: npm run backend
```

**Important**: Always test frontend changes on `http://localhost:3000` (not 3001)

## 📁 Project Structure

```
mondabot-dashboard/
├── mondabot-dashboard/          # Next.js Frontend
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   ├── components/          # React components
│   │   ├── middleware.ts        # Auth middleware
│   │   └── globals.css          # Global styles
│   ├── public/                  # Static assets
│   ├── next.config.ts           # Next.js configuration
│   └── package.json
├── server/                      # Express Backend
│   ├── server.js                # Main server file
│   ├── package.json
│   └── .env
├── scripts/                     # Utility scripts
├── Dockerfile                   # Docker configuration
├── package.json                 # Root package.json
└── README.md
```

## 🔧 Configuration Files

### Next.js Configuration (next.config.ts)

```typescript
const nextConfig: NextConfig = {
  // API proxy to backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_ENABLE_AUTHENTICATION: process.env.NEXT_PUBLIC_ENABLE_AUTHENTICATION,
  },
  
  // Webpack configuration for better error handling
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "concurrently \"npm run backend\" \"npm run frontend\"",
    "backend": "cd server && npm run dev",
    "frontend": "next dev --dir mondabot-dashboard",
    "build": "cd mondabot-dashboard && npm run build",
    "start": "cd mondabot-dashboard && npm start",
    "railway:start": "node server/server.js"
  }
}
```

## 🔐 Authentication Setup

### Clerk Configuration

1. **Create Clerk Application**:
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Create new application
   - Copy publishable key and secret key

2. **Configure Redirect URLs**:
   - Sign-in URL: `/login`
   - Sign-up URL: `/signup`
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`

3. **Environment Variables**:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

### Authentication Flow

```typescript
// ClerkProvider Configuration
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

## 🗄️ Airtable Integration

### Setup

1. **Create Airtable Base**:
   - Set up your tables (Projects, Tasks, etc.)
   - Get Base ID from URL: `https://airtable.com/appXXXXXXXXXXXXXX`

2. **Get API Key**:
   - Go to [Airtable Account](https://airtable.com/account)
   - Generate personal access token

3. **Configure Environment**:
   ```env
   AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
   AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
   ```

### Usage Example

```javascript
// server/server.js
const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

// Fetch records
app.get('/api/projects', async (req, res) => {
  try {
    const records = await base('Projects').select().all();
    res.json(records.map(record => ({ id: record.id, ...record.fields })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🚀 Deployment

### Railway Deployment

#### Option 1: Monorepo (Recommended)
Single Railway service running both servers:

```dockerfile
# Dockerfile (already configured)
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies and build
COPY package*.json ./
COPY server/package*.json ./server/
COPY mondabot-dashboard/package*.json ./mondabot-dashboard/

RUN npm install --include=dev
RUN npm install --prefix server --include=dev
RUN npm install --prefix mondabot-dashboard --include=dev

COPY . .
RUN cd mondabot-dashboard && npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Copy built application
COPY --from=builder /app ./

EXPOSE 3001
CMD ["npm", "run", "railway:start"]
```

#### Railway Configuration:
- **Build Command**: `npm run build`
- **Start Command**: `npm run railway:start`
- **Port**: `3001`

#### Environment Variables:
```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Airtable
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=app...

# Application
NODE_ENV=production
RAILWAY_ENVIRONMENT=production
NEXT_PUBLIC_ENABLE_AUTHENTICATION=true
```

#### Option 2: Dual Services
- Frontend service: Next.js only
- Backend service: Express only
- Configure service-to-service communication

## 🔧 Common Issues & Solutions

### 1. **Build Failures**

#### React Hooks Rules Violation
**Error**: `React Hook "useAuth" is called conditionally`

**Solution**: Always call hooks at the top level
```typescript
// ❌ Wrong
function Component() {
  if (condition) {
    const { user } = useAuth(); // Conditional hook call
  }
}

// ✅ Correct
function Component() {
  const { user } = useAuth(); // Always called
  
  if (condition && user) {
    // Use user conditionally
  }
}
```

#### ESLint Errors
**Error**: Unused variables, missing dependencies

**Solution**: Fix ESLint warnings before deployment
```bash
cd mondabot-dashboard
npm run lint
npm run lint -- --fix
```

### 2. **Authentication Issues**

#### Redirect Loop After Login
**Error**: Users stuck on login page after successful authentication

**Solution**: Use consistent redirect configuration
```typescript
// ClerkProvider
afterSignInUrl="/dashboard"
afterSignUpUrl="/dashboard"

// SignIn component
forceRedirectUrl="/dashboard"
fallbackRedirectUrl="/dashboard"
```

#### Authentication Not Working
**Error**: Clerk components not rendering or authentication failing

**Solution**: Check environment variables
```bash
# Verify variables are set
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
echo $CLERK_SECRET_KEY
```

### 3. **Development Issues**

#### Port Conflicts
**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**: Kill processes and restart
```bash
# Kill processes on ports
npx kill-port 3000
npx kill-port 3001

# Restart development servers
npm run dev
```

#### API Routes Not Working
**Error**: 404 errors for API calls

**Solution**: Check proxy configuration in `next.config.ts`
```typescript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:3001/api/:path*',
    },
  ];
}
```

#### Frontend Changes Not Reflecting
**Error**: Changes not visible after refresh

**Solution**: Ensure testing on correct port
- ✅ Test on `http://localhost:3000` (with proxy)
- ❌ Don't test on `http://localhost:3001` (backend only)

### 4. **Deployment Issues**

#### Railway Build Failures
**Error**: Build fails during deployment

**Solution**: Check build logs and fix issues locally first
```bash
# Test build locally
cd mondabot-dashboard
npm run build

# Check for errors and fix them
npm run lint
```

#### Environment Variables Not Set
**Error**: Application crashes due to missing environment variables

**Solution**: Set all required environment variables in Railway dashboard
```env
NODE_ENV=production
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=app...
```

#### Standalone Mode Conflicts
**Error**: Next.js standalone mode conflicts with Express server

**Solution**: Use traditional Next.js integration (already configured)
```typescript
// next.config.ts - Do NOT use standalone mode
const nextConfig: NextConfig = {
  // output: 'standalone', // ❌ Don't use this
  async rewrites() { /* proxy config */ }
};
```

### 5. **Socket.IO Issues**

#### Real-time Updates Not Working
**Error**: Socket.IO connections failing

**Solution**: Check CORS configuration
```javascript
// server/server.js
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
```

### 6. **Airtable Integration Issues**

#### API Rate Limits
**Error**: 429 Too Many Requests

**Solution**: Implement rate limiting and caching
```javascript
// Add rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

#### Invalid API Key
**Error**: 401 Unauthorized from Airtable

**Solution**: Verify API key and base ID
```bash
# Test API key
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.airtable.com/v0/YOUR_BASE_ID/YOUR_TABLE"
```

## 🧪 Testing

### Local Testing
```bash
# Test frontend build
cd mondabot-dashboard
npm run build
npm start

# Test backend
cd server
npm test

# Test full application
npm run dev
```

### Health Checks
```bash
# Backend health
curl http://localhost:3001/health

# Frontend health (through proxy)
curl http://localhost:3000/api/health
```

## 📊 Monitoring

### Development Health Check
The application includes a development health check component that shows:
- Backend connectivity status
- API endpoint availability
- Real-time connection status

### Production Monitoring
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    services: {
      airtable: 'connected',
      socket: 'active'
    }
  });
});
```

## 🛠️ Development Workflow

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and test locally
npm run dev

# Build and test
cd mondabot-dashboard
npm run build

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## 🔒 Security

### Environment Variables
- Never commit `.env` files
- Use different keys for development and production
- Rotate API keys regularly

### CORS Configuration
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

### Authentication Security
- Use HTTPS in production
- Configure proper redirect URLs
- Implement proper session management

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Clerk Documentation](https://clerk.com/docs)
- [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Railway Documentation](https://docs.railway.app/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check this documentation first
2. Search existing issues
3. Create a new issue with detailed information
4. Contact the development team

---

**Remember**: This is a professional dual-server architecture. Always preserve the separation between Next.js frontend and Express backend. Never convert to static export or merge the servers. 