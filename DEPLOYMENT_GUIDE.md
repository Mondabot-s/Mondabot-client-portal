# Mondabot Dashboard - Deployment Guide

## 🚀 Railway Deployment Guide

This guide covers deploying the Mondabot Dashboard to Railway with detailed troubleshooting steps.

## 📋 Pre-Deployment Checklist

### 1. Local Build Test
```bash
# Test Next.js build locally
cd mondabot-dashboard
npm run build

# Should complete without errors
# Check for any ESLint or TypeScript errors
```

### 2. Environment Variables Ready
Prepare all required environment variables:

```env
# Production Environment Variables
NODE_ENV=production
RAILWAY_ENVIRONMENT=production
NEXT_PUBLIC_ENABLE_AUTHENTICATION=true

# Clerk Authentication (Production Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Airtable Integration
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=app...
```

### 3. Code Quality Check
```bash
# Run linting
cd mondabot-dashboard
npm run lint

# Fix any linting errors
npm run lint -- --fix
```

## 🛠️ Railway Setup

### Step 1: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### Step 2: Configure Service

#### Build Settings:
- **Build Command**: `npm run build`
- **Start Command**: `npm run railway:start`
- **Port**: `3001`

#### Environment Variables:
Add all environment variables from the checklist above.

### Step 3: Deploy

1. Click "Deploy"
2. Monitor build logs
3. Wait for deployment to complete

## 🔧 Common Deployment Issues & Solutions

### 1. Build Failures

#### Issue: React Hooks Rules Violation
```
Error: React Hook "useAuth" is called conditionally
```

**Root Cause**: Conditional hook calls violate React rules

**Solution**:
```typescript
// ❌ Wrong - Conditional hook call
function Component() {
  try {
    const { user } = useAuth(); // This is conditional due to try-catch
  } catch (error) {
    // Handle error
  }
}

// ✅ Correct - Always call hooks at top level
function Component() {
  const { user } = useAuth(); // Always called
  
  useEffect(() => {
    // Handle auth logic conditionally
    if (user) {
      // Do something with user
    }
  }, [user]);
}
```

**Fix Steps**:
1. Remove try-catch blocks around hooks
2. Call hooks at the top level of components
3. Handle errors in useEffect or event handlers

#### Issue: ESLint Errors
```
Error: 'setAuthError' is assigned a value but never used
```

**Solution**:
```bash
# Fix ESLint errors locally
cd mondabot-dashboard
npm run lint -- --fix

# Or manually remove unused variables
```

#### Issue: TypeScript Errors
```
Error: Property 'user' does not exist on type 'AuthObject'
```

**Solution**:
```typescript
// Add proper type checking
const { user } = useAuth();

if (user) {
  // TypeScript knows user exists here
  console.log(user.id);
}
```

### 2. Next.js Configuration Issues

#### Issue: Standalone Mode Conflicts
```
Warning: You have enabled the `output: 'standalone'` option
```

**Root Cause**: Standalone mode conflicts with Express server integration

**Solution**:
```typescript
// next.config.ts - Remove standalone mode
const nextConfig: NextConfig = {
  // output: 'standalone', // ❌ Remove this line
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
  
  // Keep other configurations
};
```

#### Issue: API Proxy Not Working
```
Error: API routes returning 404
```

**Solution**:
```typescript
// Ensure proxy configuration is correct
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:3001/api/:path*',
    },
  ];
}
```

### 3. Authentication Issues

#### Issue: Redirect Loop After Login
```
Error: Users stuck on login page after successful authentication
```

**Root Cause**: Conflicting redirect configurations

**Solution**:
```typescript
// ClerkProvider configuration
<ClerkProvider
  afterSignInUrl="/dashboard"
  afterSignUpUrl="/dashboard"
  signInFallbackRedirectUrl="/dashboard"
  signUpFallbackRedirectUrl="/dashboard"
>

// SignIn component
<SignIn 
  forceRedirectUrl="/dashboard"
  fallbackRedirectUrl="/dashboard"
/>
```

**Fix Steps**:
1. Remove conflicting redirect props (`afterSignInUrl`, `redirectUrl`, `path`, `routing`)
2. Use `forceRedirectUrl` and `fallbackRedirectUrl` only
3. Ensure consistent redirect URLs across all components

#### Issue: Clerk Components Not Rendering
```
Error: Clerk components appear blank or don't load
```

**Solution**:
```typescript
// Check environment variables
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.error('Missing Clerk publishable key');
  return <div>Authentication not configured</div>;
}
```

### 4. Environment Variable Issues

#### Issue: Missing Environment Variables
```
Error: Cannot read property 'AIRTABLE_API_KEY' of undefined
```

**Solution**:
1. Verify all environment variables are set in Railway dashboard
2. Check variable names match exactly (case-sensitive)
3. Ensure no trailing spaces in values

#### Issue: Environment Variables Not Loading
```
Error: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is undefined
```

**Solution**:
```typescript
// next.config.ts - Explicitly expose environment variables
const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_ENABLE_AUTHENTICATION: process.env.NEXT_PUBLIC_ENABLE_AUTHENTICATION,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
};
```

### 5. Docker Build Issues

#### Issue: Dependencies Not Installing
```
Error: Cannot find module 'next'
```

**Solution**:
```dockerfile
# Ensure all dependencies are installed
RUN npm install --include=dev
RUN npm install --prefix server --include=dev
RUN npm install --prefix mondabot-dashboard --include=dev
```

#### Issue: Build Context Too Large
```
Error: Build context is too large
```

**Solution**:
```dockerfile
# Add .dockerignore file
node_modules
.git
.next
.env*
*.log
```

### 6. Runtime Issues

#### Issue: Server Not Starting
```
Error: Cannot find module './mondabot-dashboard'
```

**Solution**:
```javascript
// server/server.js - Check paths
const nextAppPath = path.join(__dirname, '..', 'mondabot-dashboard');
const nextBuildPath = path.join(nextAppPath, '.next');

console.log('Next.js app path:', nextAppPath);
console.log('Next.js build path:', nextBuildPath);
```

#### Issue: API Routes Not Working
```
Error: 500 Internal Server Error from API
```

**Solution**:
```javascript
// Add error handling
app.use('/api', (err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});
```

## 🔍 Debugging Steps

### 1. Check Build Logs
```bash
# In Railway dashboard, check build logs for:
- Dependency installation errors
- Build compilation errors
- Environment variable issues
```

### 2. Test Locally First
```bash
# Always test locally before deploying
cd mondabot-dashboard
npm run build

# Test production build
npm start
```

### 3. Check Health Endpoints
```bash
# Test health endpoint after deployment
curl https://your-app.railway.app/health
```

### 4. Monitor Runtime Logs
```bash
# Check Railway runtime logs for:
- Server startup errors
- API request errors
- Authentication issues
```

## 📊 Deployment Verification

### 1. Health Check
```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "services": {
    "airtable": "connected",
    "socket": "active"
  }
}
```

### 2. Authentication Test
1. Visit login page
2. Sign in with test account
3. Verify redirect to dashboard
4. Check all protected routes

### 3. API Test
```bash
# Test API endpoints
curl https://your-app.railway.app/api/projects
curl https://your-app.railway.app/api/tasks
```

### 4. Real-time Test
1. Open multiple browser tabs
2. Test Socket.IO connections
3. Verify real-time updates

## 🔄 Rollback Strategy

### If Deployment Fails:
1. **Check build logs** for specific errors
2. **Fix issues locally** and test
3. **Redeploy** with fixes
4. **Monitor** deployment logs

### If Production Issues:
1. **Check runtime logs** in Railway dashboard
2. **Verify environment variables** are set correctly
3. **Test API endpoints** individually
4. **Roll back** to previous working version if needed

## 📈 Performance Optimization

### 1. Build Optimization
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable experimental features
  experimental: {
    optimizeCss: true,
  },
};
```

### 2. Caching Strategy
```javascript
// server/server.js
app.use('/api', (req, res, next) => {
  // Cache API responses
  res.set('Cache-Control', 'public, max-age=300');
  next();
});
```

### 3. Error Monitoring
```javascript
// Add error tracking
app.use((err, req, res, next) => {
  console.error('Error:', err);
  // Send to monitoring service
  res.status(500).json({ error: 'Internal Server Error' });
});
```

## 🔒 Security Checklist

### 1. Environment Variables
- [ ] All production keys are set
- [ ] No development keys in production
- [ ] Sensitive data is not logged

### 2. CORS Configuration
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://your-domain.com',
  credentials: true
}));
```

### 3. Authentication
- [ ] Proper redirect URLs configured
- [ ] Session management working
- [ ] Protected routes secured

## 📞 Support & Troubleshooting

### Common Commands
```bash
# Check Railway CLI
railway login
railway status
railway logs

# Local debugging
npm run dev
npm run build
npm run lint
```

### Getting Help
1. Check this guide first
2. Review Railway documentation
3. Check application logs
4. Contact development team

---

**Remember**: Always test locally before deploying. The dual-server architecture must be preserved - never convert to static export or merge the servers. 