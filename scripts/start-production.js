const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Mondabot Dashboard in Production Mode...\n');

const isRailway = process.env.RAILWAY_ENVIRONMENT === 'production';
const port = process.env.PORT || 3001;

// Check if Next.js build exists
const nextBuildPath = path.join(__dirname, '..', 'mondabot-dashboard', '.next');
const nextBuildExists = fs.existsSync(nextBuildPath);

console.log(`📦 Next.js build exists: ${nextBuildExists ? '✅ Yes' : '❌ No'}`);

if (isRailway) {
  console.log('🚂 Railway Production Mode Detected');
  console.log(`📡 Starting unified server on port ${port}...\n`);
  
  // In Railway, we run the Express server which serves both API and Next.js
  const server = spawn('node', ['server/server.js'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      RAILWAY_ENVIRONMENT: 'production'
    }
  });
  
  server.on('error', (err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
  
  server.on('close', (code) => {
    console.log(`🛑 Server exited with code ${code}`);
    process.exit(code);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGTERM');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGTERM');
    process.exit(0);
  });
  
} else {
  console.log('🏠 Local Production Mode');
  
  if (nextBuildExists) {
    console.log('📡 Starting backend on port 3001...');
    console.log('🎨 Starting frontend on port 3000...\n');
    
    // Local production mode - run both servers
    const backend = spawn('node', ['server.js'], {
      cwd: path.join(__dirname, '..', 'server'),
      shell: true,
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production', PORT: 3001 }
    });
    
    backend.on('error', (err) => {
      console.error('❌ Failed to start backend:', err);
      process.exit(1);
    });
    
    setTimeout(() => {
      const frontend = spawn('npm', ['start'], {
        cwd: path.join(__dirname, '..', 'mondabot-dashboard'),
        shell: true,
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production', PORT: 3000 }
      });
      
      frontend.on('error', (err) => {
        console.error('❌ Failed to start frontend:', err);
        backend.kill();
        process.exit(1);
      });
      
      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down servers...');
        backend.kill('SIGTERM');
        frontend.kill('SIGTERM');
        process.exit(0);
      });
      
      process.on('SIGTERM', () => {
        console.log('\n🛑 Shutting down servers...');
        backend.kill('SIGTERM');
        frontend.kill('SIGTERM');
        process.exit(0);
      });
      
    }, 2000);
  } else {
    console.log('⚠️  Next.js build not found. Running API-only mode...');
    console.log('📡 Starting backend on port 3001...\n');
    
    // API-only mode
    const backend = spawn('node', ['server.js'], {
      cwd: path.join(__dirname, '..', 'server'),
      shell: true,
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production', PORT: 3001 }
    });
    
    backend.on('error', (err) => {
      console.error('❌ Failed to start backend:', err);
      process.exit(1);
    });
    
    backend.on('close', (code) => {
      console.log(`🛑 Backend exited with code ${code}`);
      process.exit(code);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down backend...');
      backend.kill('SIGTERM');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down backend...');
      backend.kill('SIGTERM');
      process.exit(0);
    });
  }
} 