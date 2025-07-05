const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

console.log('🚀 Starting Mondabot Dashboard Development Environment...\n');

// Function to check if a port is available
function checkPort(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on('error', () => resolve(false));
  });
}

// Function to wait for backend to be ready
function waitForBackend(maxAttempts = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const check = () => {
      attempts++;
      console.log(`🔍 Checking backend health... (attempt ${attempts}/${maxAttempts})`);
      
      http.get('http://localhost:3001/health', (res) => {
        if (res.statusCode === 200) {
          console.log('✅ Backend is ready!');
          resolve();
        } else {
          if (attempts < maxAttempts) {
            setTimeout(check, 1000);
          } else {
            reject(new Error('Backend health check failed'));
          }
        }
      }).on('error', (err) => {
        if (attempts < maxAttempts) {
          setTimeout(check, 1000);
        } else {
          reject(new Error(`Backend not responding: ${err.message}`));
        }
      });
    };
    
    setTimeout(check, 2000); // Initial delay
  });
}

async function startDevelopment() {
  try {
    // Check if ports are available
    const port3001Available = await checkPort(3001);
    const port3000Available = await checkPort(3000);
    
    if (!port3001Available) {
      console.error('❌ Port 3001 is already in use. Please stop the existing process.');
      process.exit(1);
    }
    
    if (!port3000Available) {
      console.error('❌ Port 3000 is already in use. Please stop the existing process.');
      process.exit(1);
    }
    
    console.log('📡 Starting Backend Server on port 3001...');
    const backend = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '..', 'server'),
      shell: true,
      stdio: 'inherit'
    });
    
    backend.on('error', (err) => {
      console.error('❌ Failed to start backend:', err);
      process.exit(1);
    });
    
    // Wait for backend to be ready
    try {
      await waitForBackend();
    } catch (err) {
      console.error('❌ Backend failed to start properly:', err.message);
      backend.kill();
      process.exit(1);
    }
    
    console.log('\n🎨 Starting Frontend Server on port 3000...');
    const frontend = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '..', 'mondabot-dashboard'),
      shell: true,
      stdio: 'inherit'
    });
    
    frontend.on('error', (err) => {
      console.error('❌ Failed to start frontend:', err);
      backend.kill();
      process.exit(1);
    });
    
    console.log('\n✅ Development servers started successfully!');
    console.log('🌐 Frontend: http://localhost:3000');
    console.log('🔧 Backend: http://localhost:3001');
    console.log('📊 Health Check: http://localhost:3001/health');
    console.log('\nPress Ctrl+C to stop both servers...\n');
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down servers...');
      backend.kill('SIGTERM');
      frontend.kill('SIGTERM');
      
      setTimeout(() => {
        backend.kill('SIGKILL');
        frontend.kill('SIGKILL');
        process.exit(0);
      }, 5000);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down servers...');
      backend.kill('SIGTERM');
      frontend.kill('SIGTERM');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start development environment:', error);
    process.exit(1);
  }
}

startDevelopment(); 