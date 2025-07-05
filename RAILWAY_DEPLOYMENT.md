# Railway Deployment Guide

This guide will help you deploy the Mondabot Dashboard (frontend + backend) to Railway using the **dual-server architecture**.

## 🏗️ Architecture Overview

This project uses a **professional dual-server architecture**:
- **Frontend**: Next.js with App Router (Port 3000)
- **Backend**: Express with Airtable integration and Socket.IO (Port 3001)  
- **Deployment**: Single Railway service running both servers via Docker

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Airtable Credentials**: You'll need your Airtable API key and Base ID

## 🚀 Pre-Deployment Testing

**IMPORTANT**: Test your deployment locally before pushing to Railway:

```bash
# Test the Railway build process
npm run test-railway

# Test production mode locally
npm run test-production
```

This will verify:
- ✅ All required files exist
- ✅ Next.js is configured for standalone builds (NOT static export)
- ✅ Railway scripts are properly configured
- ✅ Build process completes successfully
- ✅ Build artifacts are generated correctly

## Deployment Steps

### 1. Create a New Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `mondabot-dashboard` repository
5. Railway will automatically detect the Dockerfile and start building

### 2. Configure Environment Variables

In your Railway project dashboard, go to the **Variables** tab and add these environment variables:

#### Required Variables
```
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
NODE_ENV=production
RAILWAY_ENVIRONMENT=true
```

#### Optional Variables
```
FRONTEND_URL=https://your-app-name.railway.app
```

**Note**: Railway automatically sets the `PORT` variable for the main service.

### 3. Get Your Airtable Credentials

#### Airtable API Key:
1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Click "Create new token"
3. Give it a name like "Mondabot Dashboard"
4. Add these scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
5. Add access to your specific base
6. Click "Create token"
7. Copy the token (starts with `pat...`)

#### Airtable Base ID:
1. Go to your Airtable base
2. Click "Help" in the top right
3. Click "API documentation"
4. Your Base ID will be shown (starts with `app...`)

### 4. Monitor Deployment

After deployment, Railway will:
1. Build the Docker image using the Dockerfile
2. Install dependencies for both frontend and backend
3. Build the Next.js frontend in standalone mode
4. Start both services using `npm run railway:start`
5. Health check the backend at `/health`

### 5. Verify Deployment

Once deployed, test these endpoints:
- `https://your-app-name.railway.app` - Frontend application
- `https://your-app-name.railway.app/health` - Health check
- `https://your-app-name.railway.app/api/debug` - Debug information
- `https://your-app-name.railway.app/api/projects` - Airtable data

## 🔧 Troubleshooting

### Build Failures
- **Run local test first**: `npm run test-railway`
- Check the build logs in Railway dashboard
- Ensure all dependencies are properly listed in package.json files
- Verify Dockerfile syntax

### Runtime Errors
- Check the deployment logs in Railway dashboard
- Verify environment variables are set correctly
- Test Airtable connectivity using the `/api/debug` endpoint

### Frontend Not Loading
- Ensure the Next.js build completed successfully
- Check that static files are being served correctly (standalone mode)
- Verify the catch-all route is working for client-side routing

### Backend Process Exits
- Check Railway logs for detailed error messages
- Look for uncaught exceptions or unhandled rejections
- Verify Airtable credentials are correctly set

## 📋 Architecture Benefits

This deployment maintains the **professional dual-server architecture**:

### ✅ Advantages:
- **Separation of Concerns**: Frontend and backend can evolve independently
- **Scalability**: Can scale services independently in production
- **Professional Pattern**: Industry-standard microservices-ready architecture
- **Development Flexibility**: Multiple frontends can use the same backend
- **Real-time Features**: Socket.IO works perfectly with this setup

### ❌ What We DON'T Do:
- Static export (breaks Socket.IO and real-time features)
- Merge backend into Next.js API routes (reduces scalability)
- Single-port architecture (less professional)
- Remove Express backend (loses Airtable integration)

## 🚨 Common Mistakes to Avoid

1. **DON'T** change `output: 'standalone'` to `output: 'export'`
2. **DON'T** try to merge the Express backend into Next.js
3. **DON'T** remove the dual-server architecture
4. **DON'T** skip the pre-deployment testing

## 📊 File Structure

The deployment includes these key files:
- `Dockerfile` - Container configuration for dual-server setup
- `railway.json` - Railway-specific settings with health checks
- `.dockerignore` - Files to exclude from Docker build
- `server/server.js` - Express backend with production static serving
- `mondabot-dashboard/next.config.ts` - Next.js with standalone output

## 💰 Cost Estimation

Railway pricing (as of 2024):
- **Starter Plan**: $5/month for hobby projects
- **Pro Plan**: $20/month for production applications
- **Usage-based**: Pay for what you use (CPU, RAM, Network)

For a dashboard application like this, the Starter plan should be sufficient for most use cases.

## 🎯 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `AIRTABLE_API_KEY` | ✅ | Your Airtable personal access token | `patXXXXXXXXXXXXXX` |
| `AIRTABLE_BASE_ID` | ✅ | Your Airtable base identifier | `appXXXXXXXXXXXXXX` |
| `NODE_ENV` | ✅ | Node.js environment | `production` |
| `RAILWAY_ENVIRONMENT` | ✅ | Railway environment flag | `true` |
| `FRONTEND_URL` | ❌ | Your Railway app URL | `https://your-app.railway.app` |

## 🚀 Next Steps

After successful deployment:
1. Set up custom domain (optional)
2. Configure monitoring and alerts
3. Set up automated backups if needed
4. Monitor usage and performance in Railway dashboard
5. Scale services independently as needed

## 🆘 Support

If you encounter issues:
1. **First**: Run `npm run test-railway` locally
2. Check Railway documentation: [docs.railway.app](https://docs.railway.app)
3. Review application logs in Railway dashboard
4. Test locally first to isolate deployment-specific issues
5. Verify the dual-server architecture is maintained

## 🔄 Deployment Process Summary

```bash
# 1. Test locally first
npm run test-railway

# 2. If tests pass, push to GitHub
git add .
git commit -m "Railway deployment fixes"
git push origin main

# 3. Deploy to Railway
# - Create new project from GitHub repo
# - Set environment variables
# - Railway will build and deploy automatically

# 4. Monitor deployment
# - Check Railway dashboard for build logs
# - Test endpoints after deployment
# - Monitor health checks
```

Remember: This architecture is **intentionally sophisticated** and follows **industry best practices**. Don't simplify it - embrace the professional dual-server setup! 🚀 