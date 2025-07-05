# Quick Start Guide for Windows Users

## Problem Fixed

The original issue was a **port configuration mismatch**:
- Frontend was trying to run on port 3002
- Backend was running on port 3001  
- Next.js proxy was trying to connect to port 3002 (wrong port)
- This caused `ERR_TOO_MANY_REDIRECTS` errors

## Solution Applied

✅ **Fixed Next.js configuration** (`mondabot-dashboard/next.config.ts`)
- Changed proxy destination from `localhost:3002` to `localhost:3001`

✅ **Standardized frontend port** (`mondabot-dashboard/package.json`) 
- Changed from `next dev -p 3002` to `next dev` (defaults to port 3000)

✅ **Updated CORS configuration** (`server/server.js`)
- Fixed all references to use `localhost:3000` for frontend

✅ **Created Windows-compatible scripts**
- PowerShell scripts that handle port conflicts
- Automatic dependency installation
- Proper server startup in separate windows

## Quick Start Commands

### Option 1: Automatic Setup (Recommended)
```powershell
# Run the comprehensive setup script
npm run dev:windows
```

### Option 2: Force Restart (if ports are in use)
```powershell
# Stop all Node processes and restart
npm run dev:windows:force
```

### Option 3: Clean Install
```powershell
# Clean everything and reinstall
npm run dev:windows:clean
```

### Option 4: Manual Commands
```powershell
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend  
cd mondabot-dashboard
npm run dev
```

## Access Points

Once both servers are running:
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:3001  
- **Health Check**: http://localhost:3001/health
- **API Debug Info**: http://localhost:3001/api/debug

## Troubleshooting

### If you still get errors:

1. **Kill all Node processes:**
   ```powershell
   taskkill /F /IM node.exe
   ```

2. **Check if ports are free:**
   ```powershell
   netstat -ano | findstr :3000
   netstat -ano | findstr :3001
   ```

3. **Verify setup:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts/verify-setup.ps1
   ```

4. **Check server health:**
   ```powershell
   npm run health
   ```

## Configuration Summary

| Component | Port | URL | Status |
|-----------|------|-----|--------|
| Frontend (Next.js) | 3000 | http://localhost:3000 | ✅ Fixed |
| Backend (Express) | 3001 | http://localhost:3001 | ✅ Working |
| Proxy Configuration | N/A | `/api/*` → `3001/api/*` | ✅ Fixed |

## Notes

- Keep both PowerShell windows open while developing
- Changes will auto-reload both servers
- Check the server console windows for error messages
- Environment variables are configured in `server/.env`

## Success Indicators

You'll know it's working when:
1. Two PowerShell windows open (one blue for backend, one green for frontend)
2. Backend shows: "Express server running on http://localhost:3001"
3. Frontend shows: "Ready - started server on 0.0.0.0:3000"
4. No more "ERR_TOO_MANY_REDIRECTS" errors
5. Automations page loads data successfully

---

**All port configuration issues have been resolved!** 🎉 