# Mondabot Dashboard - Troubleshooting Guide

## 🚨 Common Issues & Solutions

This guide documents all the issues we've encountered and their solutions during development and deployment.

## 🔧 Build Issues

### 1. React Hooks Rules Violation

#### Error Message:
```
Error: React Hook "useAuth" is called conditionally. React Hooks must be called in the exact same order in every component render.
```

#### Root Cause:
- Hooks called inside try-catch blocks
- Conditional hook calls
- Hooks called after early returns

#### Solution:
```typescript
// ❌ WRONG - Conditional hook call
function Layout() {
  try {
    const { user } = useAuth(); // This is conditional due to try-catch
  } catch (error) {
    setAuthError(error.message);
  }
}

// ✅ CORRECT - Always call hooks at top level
function Layout() {
  const { user } = useAuth(); // Always called at top level
  
  useEffect(() => {
    // Handle auth logic conditionally
    if (user) {
      // Redirect logic here
    }
  }, [user]);
}
```

#### Fix Steps:
1. Move all hooks to the top level of components
2. Remove try-catch blocks around hooks
3. Handle errors in useEffect or event handlers
4. Use conditional logic after hooks are called

### 2. ESLint Errors

#### Error Message:
```
Error: 'setAuthError' is assigned a value but never used
```

#### Solution:
```bash
# Fix ESLint errors automatically
cd mondabot-dashboard
npm run lint -- --fix

# Or manually remove unused variables
```

#### Common ESLint Fixes:
- Remove unused variables
- Add missing dependencies to useEffect
- Fix missing return statements
- Add proper TypeScript types

### 3. TypeScript Errors

#### Error Message:
```
Error: Property 'user' does not exist on type 'AuthObject'
```

#### Solution:
```typescript
// Add proper type checking
const { user } = useAuth();

if (user) {
  // TypeScript knows user exists here
  console.log(user.id);
}
```

## 🔐 Authentication Issues

### 1. Redirect Loop After Login

#### Symptoms:
- User successfully logs in
- Gets stuck on login page showing "Welcome Back"
- Never redirects to dashboard

#### Root Cause:
Conflicting redirect configurations in Clerk components

#### Solution:
```typescript
// ❌ WRONG - Multiple conflicting redirect props
<SignIn 
  afterSignInUrl="/"
  afterSignUpUrl="/"
  redirectUrl="/"
  path="/login"
  routing="path"
/>

// ✅ CORRECT - Clean redirect configuration
<SignIn 
  forceRedirectUrl="/dashboard"
  fallbackRedirectUrl="/dashboard"
/>
```

#### Fix Steps:
1. Remove conflicting props: `afterSignInUrl`, `redirectUrl`, `path`, `routing`
2. Use only `forceRedirectUrl` and `fallbackRedirectUrl`
3. Ensure consistent redirect URLs across all components
4. Update ClerkProvider configuration

### 2. Clerk Components Not Rendering

#### Symptoms:
- Login/signup pages appear blank
- Clerk components don't load
- Authentication flows don't work

#### Root Cause:
- Missing environment variables
- Incorrect publishable key
- Network issues

#### Solution:
```typescript
// Check environment variables
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.error('Missing Clerk publishable key');
  return <div>Authentication not configured</div>;
}
```

#### Fix Steps:
1. Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
2. Check `CLERK_SECRET_KEY` is set
3. Ensure keys are for correct environment (dev/prod)
4. Restart development server after adding keys

### 3. Authentication Middleware Issues

#### Error Message:
```
Error: Cannot read property 'pathname' of undefined
```

#### Root Cause:
URL construction issues in middleware

#### Solution:
```typescript
// ❌ WRONG - Unsafe URL construction
const redirectUrl = `${req.url}`;

// ✅ CORRECT - Safe URL construction
const redirectUrl = new URL(req.url, req.nextUrl.origin).toString();
```

## 🚀 Deployment Issues

### 1. Next.js Standalone Mode Conflicts

#### Error Message:
```
Warning: You have enabled the `output: 'standalone'` option
```

#### Root Cause:
Standalone mode conflicts with Express server integration

#### Solution:
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
};
```

#### Why This Happens:
- Standalone mode creates self-contained Next.js server
- Conflicts with Express server for API routes
- Breaks Socket.IO and Airtable integration

### 2. Railway Build Failures

#### Error Message:
```
Error: Command failed with exit code 1
```

#### Common Causes:
1. **ESLint errors** - Fix with `npm run lint -- --fix`
2. **TypeScript errors** - Fix type issues
3. **Missing dependencies** - Check package.json
4. **Environment variables** - Ensure all required vars are set

#### Solution Steps:
1. Test build locally first:
   ```bash
   cd mondabot-dashboard
   npm run build
   ```
2. Fix any errors locally
3. Commit and push fixes
4. Redeploy on Railway

### 3. Environment Variable Issues

#### Error Message:
```
Error: Cannot read property 'AIRTABLE_API_KEY' of undefined
```

#### Solution:
1. Verify all environment variables are set in Railway dashboard
2. Check variable names match exactly (case-sensitive)
3. Ensure no trailing spaces in values
4. Restart deployment after adding variables

#### Required Environment Variables:
```env
# Production
NODE_ENV=production
RAILWAY_ENVIRONMENT=production
NEXT_PUBLIC_ENABLE_AUTHENTICATION=true

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Airtable
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=app...
```

## 🔧 Development Issues

### 1. Port Conflicts

#### Error Message:
```
Error: EADDRINUSE: address already in use :::3000
```

#### Solution:
```bash
# Kill processes on ports
npx kill-port 3000
npx kill-port 3001

# Or find and kill manually
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Restart development servers
npm run dev
```

### 2. API Routes Not Working

#### Symptoms:
- 404 errors for API calls
- Frontend can't reach backend
- API endpoints return errors

#### Root Cause:
Proxy configuration issues in Next.js

#### Solution:
```typescript
// next.config.ts - Ensure proxy is configured
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:3001/api/:path*',
    },
  ];
}
```

#### Testing:
- ✅ Test on `http://localhost:3000` (with proxy)
- ❌ Don't test on `http://localhost:3001` (backend only)

### 3. Frontend Changes Not Reflecting

#### Symptoms:
- Changes don't appear after refresh
- Old code still running
- Hot reload not working

#### Solutions:
1. **Check correct port**: Use `localhost:3000`, not `3001`
2. **Clear Next.js cache**:
   ```bash
   rm -rf mondabot-dashboard/.next
   npm run dev
   ```
3. **Hard refresh**: Ctrl+Shift+R or Cmd+Shift+R
4. **Check file watchers**: Restart development server

## 🔌 Socket.IO Issues

### 1. Real-time Updates Not Working

#### Symptoms:
- Socket.IO connections failing
- Real-time updates not received
- WebSocket errors in console

#### Root Cause:
CORS configuration issues

#### Solution:
```javascript
// server/server.js
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

### 2. Connection Refused Errors

#### Error Message:
```
Error: WebSocket connection to 'ws://localhost:3001/socket.io/' failed
```

#### Solution:
1. Ensure backend server is running
2. Check CORS configuration
3. Verify port numbers are correct
4. Test Socket.IO endpoint directly

## 🗄️ Airtable Integration Issues

### 1. API Rate Limits

#### Error Message:
```
Error: 429 Too Many Requests
```

#### Solution:
```javascript
// Add rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 2. Invalid API Key

#### Error Message:
```
Error: 401 Unauthorized
```

#### Solution:
1. Verify API key is correct
2. Check base ID is correct
3. Ensure API key has proper permissions
4. Test API key with curl:
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.airtable.com/v0/YOUR_BASE_ID/YOUR_TABLE"
   ```

## 🐛 PowerShell Command Issues

### 1. Command Separator Errors

#### Error Message:
```
The token '&&' is not a valid statement separator in this version.
```

#### Solution:
```powershell
# ❌ WRONG - Using && in PowerShell
cd mondabot-dashboard && npm run build

# ✅ CORRECT - Using ; in PowerShell
cd mondabot-dashboard; npm run build

# Or use separate commands
cd mondabot-dashboard
npm run build
```

## 🔍 Debugging Tools

### 1. Health Check Endpoints

```bash
# Backend health
curl http://localhost:3001/health

# Frontend health (through proxy)
curl http://localhost:3000/api/health
```

### 2. Log Debugging

```javascript
// Add debug logging
console.log('Environment:', process.env.NODE_ENV);
console.log('Clerk Key:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Missing');
console.log('Airtable Key:', process.env.AIRTABLE_API_KEY ? 'Set' : 'Missing');
```

### 3. Network Debugging

```bash
# Check if ports are listening
netstat -tlnp | grep :3000
netstat -tlnp | grep :3001

# Test API endpoints
curl -v http://localhost:3001/api/health
```

## 📊 Performance Issues

### 1. Slow Build Times

#### Solutions:
1. **Clear cache**:
   ```bash
   rm -rf node_modules/.cache
   rm -rf mondabot-dashboard/.next
   ```
2. **Update dependencies**:
   ```bash
   npm update
   ```
3. **Optimize webpack config** in `next.config.ts`

### 2. Memory Issues

#### Error Message:
```
Error: JavaScript heap out of memory
```

#### Solution:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## 🔄 Recovery Procedures

### 1. Complete Reset

```bash
# Stop all processes
npx kill-port 3000
npx kill-port 3001

# Clean all caches
rm -rf node_modules
rm -rf mondabot-dashboard/.next
rm -rf mondabot-dashboard/node_modules
rm -rf server/node_modules

# Reinstall dependencies
npm install
npm install --prefix server
npm install --prefix mondabot-dashboard

# Restart development
npm run dev
```

### 2. Database Reset

```bash
# Clear Airtable cache (if implemented)
# Reset local database connections
# Verify API keys are working
```

### 3. Authentication Reset

```bash
# Clear browser cookies and local storage
# Reset Clerk session
# Verify environment variables
```

## 📞 Getting Help

### 1. Information to Gather

When reporting issues, include:
- Error messages (full stack trace)
- Steps to reproduce
- Environment (dev/prod)
- Browser/Node.js versions
- Recent changes made

### 2. Useful Commands

```bash
# System information
node --version
npm --version
git --version

# Project status
npm run dev
npm run build
npm run lint

# Network testing
curl -v http://localhost:3000/api/health
curl -v http://localhost:3001/health
```

### 3. Log Files

Check these log locations:
- Browser console (F12)
- Terminal output
- Railway deployment logs
- Network tab in browser dev tools

---

**Remember**: Always test locally before deploying. Most issues can be caught and fixed in development before they reach production. 