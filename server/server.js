const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const next = require('next');

// Load environment variables FIRST with error handling
try {
  require('dotenv').config({ 
    path: path.resolve(__dirname, '.env') 
  });
  console.log('✅ Dotenv loaded from:', path.resolve(__dirname, '.env'));
} catch (error) {
  console.error('⚠️  Warning: Could not load dotenv:', error.message);
}

// Log environment status immediately
console.log('\n🔍 Environment Check on Startup:');
console.log('   AIRTABLE_API_KEY:', process.env.AIRTABLE_API_KEY ? `✅ Found (${process.env.AIRTABLE_API_KEY.substring(0,4)}...)` : '❌ MISSING');
console.log('   AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID ? `✅ Found (${process.env.AIRTABLE_BASE_ID})` : '❌ MISSING');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('   Working Directory:', process.cwd());
console.log('\n');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());

// CORS - Using the cors package for better compatibility
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL,
        process.env.RAILWAY_STATIC_URL,
        process.env.RAILWAY_PUBLIC_DOMAIN,
        'https://*.railway.app'
      ].filter(Boolean)
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173'
      ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Request logging
app.use((req, res, next) => {
  console.log(`📨 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize variables for Airtable (but don't crash if it fails)
let base = null;
let io = null;
let Airtable = null;

// Try to load Airtable module
try {
  Airtable = require('airtable');
  console.log('✅ Airtable module loaded');
} catch (error) {
  console.error('❌ Could not load Airtable module:', error.message);
  console.error('   Run: npm install airtable');
}

// Try to initialize Airtable (but don't crash if it fails)
if (Airtable && process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
  try {
    base = new Airtable({ 
      apiKey: process.env.AIRTABLE_API_KEY,
      endpointUrl: 'https://api.airtable.com',
      requestTimeout: 30000
    }).base(process.env.AIRTABLE_BASE_ID);
    console.log('✅ Airtable client initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Airtable client:', error.message);
    base = null;
  }
} else {
  console.warn('⚠️  Airtable not initialized - missing module or credentials');
}

// Try to initialize Socket.IO (but don't crash if it fails)
try {
  const socketIo = require('socket.io');
  io = socketIo(server, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        process.env.FRONTEND_URL,
        process.env.RAILWAY_STATIC_URL,
        process.env.RAILWAY_PUBLIC_DOMAIN,
        // Allow Railway internal communication
        'http://localhost:3000',
        'https://*.railway.app'
      ].filter(Boolean),
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['polling', 'websocket'],
    allowEIO3: true
  });
  
  io.on('connection', (socket) => {
    console.log('✅ Socket.IO client connected:', socket.id);
    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket.IO client disconnected:', socket.id, 'Reason:', reason);
    });
  });
  
  console.log('✅ Socket.IO initialized');
} catch (error) {
  console.error('⚠️  Socket.IO not initialized:', error.message);
  console.error('   Run: npm install socket.io');
}

// Health check endpoint - ALWAYS WORKS
app.get('/health', (req, res) => {
  console.log('Health check requested');
  const currentPort = process.env.API_PORT || process.env.PORT || 3001;
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    port: currentPort,
    environment: process.env.NODE_ENV || 'development',
    railway: process.env.RAILWAY_ENVIRONMENT || 'local',
    uptime: process.uptime(),
    airtable: {
      apiKey: process.env.AIRTABLE_API_KEY ? 'configured' : 'missing',
      baseId: process.env.AIRTABLE_BASE_ID ? 'configured' : 'missing',
      ready: !!base
    },
    socketIo: {
      ready: !!io
    },
    server: 'express-backend'
  });
});

// Add for debugging
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    backend: 'running',
    port: process.env.PORT || 3001,
    timestamp: new Date().toISOString(),
    service: 'mondabot-backend-api'
  });
});

// Debug endpoint - ALWAYS WORKS
app.get('/api/debug', (req, res) => {
  const currentPort = process.env.API_PORT || process.env.PORT || 3001;
  res.json({
    server: 'Express server is running',
    port: currentPort,
    environment: {
      airtableKey: process.env.AIRTABLE_API_KEY ? 'Set' : 'Not set',
      baseId: process.env.AIRTABLE_BASE_ID || 'Not set',
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      cwd: process.cwd(),
      railway: process.env.RAILWAY_ENVIRONMENT || 'local',
      apiPort: process.env.API_PORT || 'not set',
      frontendUrl: process.env.FRONTEND_URL || 'not set'
    },
    modules: {
      express: '✅ Loaded',
      airtable: Airtable ? '✅ Loaded' : '❌ Not loaded',
      socketIo: io ? '✅ Loaded' : '❌ Not loaded',
      dotenv: '✅ Loaded'
    },
    initialization: {
      airtableClient: base ? '✅ Ready' : '❌ Not initialized',
      socketIo: io ? '✅ Ready' : '❌ Not initialized'
    }
  });
});

// Test endpoint - returns dummy data if Airtable isn't working
app.get('/api/test-projects', async (req, res) => {
  res.json([
    { id: '1', name: 'Test Project 1', status: 'Building' },
    { id: '2', name: 'Test Project 2', status: 'Live' },
    { id: '3', name: 'Test Project 3', status: 'Testing' }
  ]);
});

// Main projects endpoint with comprehensive error handling
app.get('/api/projects', async (req, res) => {
  console.log('\n📋 GET /api/projects called');
  
  // Read the sortBy query parameter from the request
  const { sortBy } = req.query;
  console.log('   Sort parameter:', sortBy || 'default');
  
  // Check if Airtable is initialized
  if (!base) {
    console.error('❌ Airtable not initialized');
    
    const missingItems = [];
    if (!Airtable) missingItems.push('Airtable module (run: npm install airtable)');
    if (!process.env.AIRTABLE_API_KEY) missingItems.push('AIRTABLE_API_KEY in .env file');
    if (!process.env.AIRTABLE_BASE_ID) missingItems.push('AIRTABLE_BASE_ID in .env file');
    
    return res.status(503).json({
      error: 'Airtable not configured',
      message: 'The server is running but Airtable is not properly configured',
      missing: missingItems,
      help: 'Please check server console for details'
    });
  }
  
  try {
    console.log('🔄 Attempting to fetch from Airtable...');
    console.log('   Base ID:', process.env.AIRTABLE_BASE_ID);
    console.log('   Table: Projects (or tblJCWNtJPspIxcDC)');
    
    // Prepare the sort options for the Airtable API call
    const sortOptions = [];
    switch (sortBy) {
      case 'name':
        // Use the actual field name from your Airtable base
        sortOptions.push({ field: 'Project Name', direction: 'asc' });
        break;
      case 'status':
        sortOptions.push({ field: 'Status', direction: 'asc' });
        break;
      case 'deadline':
        sortOptions.push({ field: 'Deadline', direction: 'asc' });
        break;
      default:
        // Default sort - no specific sort order (Airtable default)
        break;
    }
    
    let records;
    
    // Try with table name first
    try {
      const selectOptions = {
        maxRecords: 100
      };
      // Add sort options if specified
      if (sortOptions.length > 0) {
        selectOptions.sort = sortOptions;
      }
      
      records = await base('Projects').select(selectOptions).all();
      console.log('✅ Fetched using table name "Projects"');
    } catch (nameError) {
      if (nameError.statusCode === 404) {
        console.log('⚠️  Table name "Projects" not found, trying table ID...');
        // Try with table ID
        const selectOptions = {
          maxRecords: 100
        };
        // Add sort options if specified
        if (sortOptions.length > 0) {
          selectOptions.sort = sortOptions;
        }
        
        records = await base('tblJCWNtJPspIxcDC').select(selectOptions).all();
        console.log('✅ Fetched using table ID "tblJCWNtJPspIxcDC"');
      } else {
        throw nameError;
      }
    }
    
    console.log(`✅ Successfully fetched ${records.length} records`);
    if (sortOptions.length > 0) {
      console.log(`   Applied sort: ${sortOptions.map(s => `${s.field} (${s.direction})`).join(', ')}`);
    }
    
    // Map records - try both field names and field IDs
    const projects = records.map(record => {
      const getField = (fieldName, fieldId, defaultValue = '') => {
        return record.get(fieldName) || record.get(fieldId) || defaultValue;
      };
      
      return {
        id: record.id,
        projectId: getField('Project ID', 'fldt2uqsBAs8iQlyL', ''),
        name: getField('Project Name', 'fldV9xdwcDkMt9dNO', 'Unnamed Project'),
        status: getField('Status', 'fld94mbrM8R9c8apl', 'Building'),
        deadline: getField('Deadline', 'fld6BTXsUHNTWYlrv', null),
        assignedManager: getField('Manager (from Assigned Manager)', 'fldmBfIV2rtlr4ZWB', []),
        tasks: getField('Tasks', 'fld5lb8nCSK4xBPo5', [])
      };
    });
    
    res.json(projects);
    
  } catch (error) {
    console.error('❌ Airtable request failed:', error);
    
    // Detailed error response
    const errorResponse = {
      error: 'Airtable request failed',
      message: error.message,
      type: error.constructor.name
    };
    
    if (error.statusCode) {
      errorResponse.statusCode = error.statusCode;
      
      switch (error.statusCode) {
        case 401:
          errorResponse.help = 'Invalid API key. Check AIRTABLE_API_KEY in .env file';
          break;
        case 403:
          errorResponse.help = 'API key does not have access to this base';
          break;
        case 404:
          errorResponse.help = 'Base or table not found. Verify base ID: ' + process.env.AIRTABLE_BASE_ID;
          break;
        case 422:
          errorResponse.help = 'Invalid request format';
          break;
        case 429:
          errorResponse.help = 'Rate limited. Wait 30 seconds';
          break;
      }
    }
    
    res.status(error.statusCode || 500).json(errorResponse);
  }
});

// Tasks endpoint with proper field mapping
app.get('/api/tasks', async (req, res) => {
  console.log('\n📋 GET /api/tasks called');
  
  if (!base) {
    console.error('❌ Airtable not initialized');
    
    const missingItems = [];
    if (!Airtable) missingItems.push('Airtable module (run: npm install airtable)');
    if (!process.env.AIRTABLE_API_KEY) missingItems.push('AIRTABLE_API_KEY in .env file');
    if (!process.env.AIRTABLE_BASE_ID) missingItems.push('AIRTABLE_BASE_ID in .env file');
    
    return res.status(503).json({
      error: 'Airtable not configured',
      message: 'The server is running but Airtable is not properly configured',
      missing: missingItems,
      help: 'Please check server console for details'
    });
  }
  
  try {
    console.log('🔄 Attempting to fetch tasks from Airtable...');
    console.log('   Base ID:', process.env.AIRTABLE_BASE_ID);
    console.log('   Table ID: tblTu01GpPvZM70Hw');
    
    const records = await base('tblTu01GpPvZM70Hw').select({
      maxRecords: 100
    }).all();
    
    console.log(`✅ Successfully fetched ${records.length} task records`);
    
    // Map records with proper field handling - try both field names and field IDs
    const tasks = records.map(record => {
      const getField = (fieldName, fieldId, defaultValue = null) => {
        return record.get(fieldName) || record.get(fieldId) || defaultValue;
      };
      
      const task = {
        id: record.id,
        'Task Name': getField('Task Name', 'fld0BQXbL0G5dfl7z', 'Unnamed Task'),
        'Status': getField('Status', 'fldfbAZh2JMnYAN9f', 'To Do'),
        'ID': getField('ID', 'flduiMhOfkMlvyU4B', null),
        'Projects': getField('Projects', 'fldOQNniyKq2irRQf', [])
      };
      
      // Log first few records for debugging
      if (records.indexOf(record) < 3) {
        console.log(`   Task ${records.indexOf(record) + 1}:`, {
          id: task.id,
          name: task['Task Name'],
          status: task['Status'],
          projects: task['Projects']
        });
      }
      
      return task;
    });
    
    res.json(tasks);
    
  } catch (error) {
    console.error('❌ Airtable tasks request failed:', error);
    
    // Detailed error response
    const errorResponse = {
      error: 'Airtable tasks request failed',
      message: error.message,
      type: error.constructor.name
    };
    
    if (error.statusCode) {
      errorResponse.statusCode = error.statusCode;
      
      switch (error.statusCode) {
        case 401:
          errorResponse.help = 'Invalid API key. Check AIRTABLE_API_KEY in .env file';
          break;
        case 403:
          errorResponse.help = 'API key does not have access to this base';
          break;
        case 404:
          errorResponse.help = 'Base or table not found. Verify base ID and table ID tblTu01GpPvZM70Hw';
          break;
        case 422:
          errorResponse.help = 'Invalid request format';
          break;
        case 429:
          errorResponse.help = 'Rate limited. Wait 30 seconds';
          break;
      }
    }
    
    res.status(error.statusCode || 500).json(errorResponse);
  }
});

// Webhook endpoint for Airtable updates
app.post('/api/webhooks/airtable-update', (req, res) => {
  try {
    console.log('Received Airtable webhook:', req.body);
    
    // Broadcast the update to all connected clients if Socket.IO is available
    if (io) {
      io.emit('task_updated', req.body);
    }
    
    res.status(200).json({ message: 'Webhook received successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ 
      message: 'Error processing webhook',
      error: error.message 
    });
  }
});

// Add webhook endpoint for real-time project updates
app.post('/api/webhooks/airtable-projects', (req, res) => {
  try {
    console.log('Received Airtable projects webhook:', req.body);
    
    // Broadcast the update to all connected clients if Socket.IO is available
    if (io) {
      io.emit('projects_updated', req.body);
    }
    
    res.status(200).json({ message: 'Webhook received successfully' });
  } catch (error) {
    console.error('Error processing projects webhook:', error);
    res.status(500).json({ 
      message: 'Error processing webhook',
      error: error.message 
    });
  }
});

// Project details endpoint
app.get('/api/projects/:id', async (req, res) => {
  console.log(`\n📋 GET /api/projects/${req.params.id} called`);
  
  if (!base) {
    return res.status(503).json({
      error: 'Airtable not configured',
      message: 'The server is running but Airtable is not properly configured'
    });
  }
  
  try {
    console.log('🔄 Attempting to fetch project from Airtable...');
    console.log('   Project ID:', req.params.id);
    
    let record;
    
    // Try with table name first
    try {
      record = await base('Projects').find(req.params.id);
      console.log('✅ Fetched using table name "Projects"');
    } catch (nameError) {
      if (nameError.statusCode === 404) {
        console.log('⚠️  Table name "Projects" not found, trying table ID...');
        // Try with table ID
        record = await base('tblJCWNtJPspIxcDC').find(req.params.id);
        console.log('✅ Fetched using table ID "tblJCWNtJPspIxcDC"');
      } else {
        throw nameError;
      }
    }
    
    console.log('✅ Successfully fetched project record');
    
    // Map record - try both field names and field IDs
    const getField = (fieldName, fieldId, defaultValue = '') => {
      return record.get(fieldName) || record.get(fieldId) || defaultValue;
    };
    
    const project = {
      id: record.id,
      projectId: getField('Project ID', 'fldt2uqsBAs8iQlyL', ''),
      name: getField('Project Name', 'fldV9xdwcDkMt9dNO', 'Unnamed Project'),
      status: getField('Status', 'fld94mbrM8R9c8apl', 'Building'),
      deadline: getField('Deadline', 'fld6BTXsUHNTWYlrv', null),
      assignedManager: getField('Manager (from Assigned Manager)', 'fldmBfIV2rtlr4ZWB', []),
      tasks: getField('Tasks', 'fld5lb8nCSK4xBPo5', [])
    };
    
    res.json(project);
    
  } catch (error) {
    console.error('❌ Airtable project request failed:', error);
    
    if (error.statusCode === 404) {
      return res.status(404).json({
        error: 'Project not found',
        message: `Project with ID ${req.params.id} was not found`
      });
    }
    
    // Detailed error response
    const errorResponse = {
      error: 'Airtable project request failed',
      message: error.message,
      type: error.constructor.name
    };
    
    if (error.statusCode) {
      errorResponse.statusCode = error.statusCode;
    }
    
    res.status(error.statusCode || 500).json(errorResponse);
  }
});

// 404 handler - This will now be handled by the Next.js catch-all in production
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} does not exist on the Express server.`
  });
});

// Final error handler
app.use((err, req, res, next) => {
  console.error('💥 Unhandled Express error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// CRITICAL: In production, all non-API routes are handed to Next.js.
// This block MUST come AFTER all other API routes and BEFORE the server starts.
if (process.env.NODE_ENV === 'production') {
  console.log('✅ Production mode detected. Initializing Next.js request handler...');
  
  const nextAppPath = path.join(__dirname, '..', 'mondabot-dashboard');
  
  // Check if Next.js is available
  let nextModule;
  try {
    nextModule = require('next');
    console.log('✅ Next.js module loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load Next.js module:', error.message);
    console.error('   This is likely a dependency issue. Next.js should be installed in server/package.json');
    console.error('   Continuing without Next.js integration - API routes will still work');
    startServer();
    return;
  }
  
  // Use proper Next.js initialization
  const dev = false;
  const nextApp = nextModule({
    dev,
    dir: nextAppPath, // Points to the 'mondabot-dashboard' directory
    conf: {
      distDir: '.next',
      output: 'standalone'
    }
  });
  const handle = nextApp.getRequestHandler();
  
  console.log('✅ Next.js app created. Preparing...');
  
  // Wrap everything in nextApp.prepare() to ensure proper initialization
  nextApp.prepare().then(() => {
    console.log('✅ Next.js app prepared successfully.');
    
    // This is the catch-all that sends all other requests to Next.js
    app.all('*', (req, res) => {
      // Skip API routes - they should be handled by Express
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({
          error: 'API route not found',
          message: `API route ${req.method} ${req.path} does not exist`
        });
      }
      
      // Handle all other routes with Next.js
      return handle(req, res);
    });
    
    // Start server after Next.js is ready
    startServer();
  }).catch(err => {
    console.error('❌ Error preparing Next.js app:', err);
    console.error('   Continuing without Next.js integration - API routes will still work');
    startServer();
  });
} else {
  // In development, start server immediately (no Next.js integration)
  startServer();
}

// Extract server startup logic into a function
function startServer() {
  // Port configuration for Railway - Railway sets PORT, use that as primary
  const API_PORT = process.env.PORT || process.env.API_PORT || 3001;
  const FRONTEND_URL = process.env.FRONTEND_URL || `http://localhost:${API_PORT}`;

  console.log(`🔧 Starting Express server on port ${API_PORT}`);
  console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);

  server.listen(API_PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Express server running on http://localhost:${API_PORT}`);
    console.log('\n📊 Available endpoints:');
    console.log(`   GET  http://localhost:${API_PORT}/health - Server health check`);
    console.log(`   GET  http://localhost:${API_PORT}/api/debug - Debug information`);
    console.log(`   GET  http://localhost:${API_PORT}/api/test-projects - Test endpoint (dummy data)`);
    console.log(`   GET  http://localhost:${API_PORT}/api/projects - Fetch projects from Airtable`);
    console.log(`   GET  http://localhost:${API_PORT}/api/tasks - Fetch tasks from Airtable`);
    
    console.log('\n🔧 Environment Info:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   RAILWAY_ENVIRONMENT: ${process.env.RAILWAY_ENVIRONMENT || 'local'}`);
    console.log(`   API_PORT: ${API_PORT}`);
    console.log(`   FRONTEND_URL: ${FRONTEND_URL}`);
    
    if (!base) {
      console.log('\n⚠️  WARNING: Airtable is not configured!');
      console.log('   The server is running but cannot fetch real data.');
      console.log('   Check the missing items listed above.');
    } else {
      console.log('\n✅ Server is ready to handle requests!');
    }
  });
}

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${API_PORT} is already in use!`);
    console.error('   Another process is using this port.');
    console.error('   Solutions:');
    console.error('   1. Kill the other process: taskkill /F /IM node.exe (Windows)');
    console.error('   2. Use a different port: API_PORT=3002 npm run server');
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    process.exit(1);
  }
});

// Enhanced process monitoring for debugging
process.on('SIGINT', () => {
  console.log('\n👋 Received SIGINT - Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed cleanly');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n👋 Received SIGTERM - Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed cleanly');
    process.exit(0);
  });
});

// Catch uncaught exceptions with detailed logging
process.on('uncaughtException', (error) => {
  console.error('\n💥 Uncaught Exception Details:');
  console.error('   Error:', error.message);
  console.error('   Stack:', error.stack);
  console.error('   Code:', error.code);
  console.error('   Signal:', error.signal);
  console.error('   Time:', new Date().toISOString());
  
  // Give some time for logging before exit
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n💥 Unhandled Rejection Details:');
  console.error('   Promise:', promise);
  console.error('   Reason:', reason);
  console.error('   Time:', new Date().toISOString());
  
  // Give some time for logging before exit
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Monitor process exit events
process.on('exit', (code) => {
  console.log(`\n🔚 Process exiting with code: ${code}`);
  if (code !== 0) {
    console.log('   This was an unexpected exit!');
  }
});

module.exports = { app, server, io }; 