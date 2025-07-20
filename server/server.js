const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const next = require('next');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

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
console.log('   AIRTABLE_API_KEY:', process.env.AIRTABLE_API_KEY ? `✅ Found (${process.env.AIRTABLE_API_KEY.substring(0, 4)}...)` : '❌ MISSING');
console.log('   AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID ? `✅ Found (${process.env.AIRTABLE_BASE_ID})` : '❌ MISSING');
console.log('   CLOUDINARY_URL:', process.env.CLOUDINARY_URL ? `✅ Found (cloudinary://...)` : '❌ MISSING');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('   Working Directory:', process.cwd());
console.log('\n');

// Configure Cloudinary with your credentials
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Always use HTTPS
  });
  console.log('✅ Cloudinary configured with credentials');
} catch (error) {
  console.error('❌ Failed to configure Cloudinary:', error.message);
}

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

// Test files endpoint - returns all files without filtering for debugging
app.get('/api/test-files', async (req, res) => {
  console.log('\n📁 GET /api/test-files called (no filtering)');

  if (!base) {
    return res.status(503).json({ error: 'Airtable not configured' });
  }

  try {
    // Fetch all files without any filtering
    const records = await base('tblYU4F7eZzvpLDdz').select({
      maxRecords: 10
    }).all();

    console.log(`📁 Found ${records.length} total files`);

    const files = records.map(record => {
      const clientNameRaw = record.get('Client Name') || record.get('flddVpS1iqNTvHKS5') || '';
      console.log(`📁 File ${record.id}: Client Name =`, clientNameRaw, typeof clientNameRaw);

      return {
        id: record.id,
        name: record.get('Document Name') || record.get('fldaW2mM0MQn1txVH') || 'Unknown',
        clientName: clientNameRaw,
        uploader: record.get('Uploader') || record.get('fldyuECEg4bIo6qKx') || 'Unknown'
      };
    });

    res.json(files);
  } catch (error) {
    console.error('❌ Test files error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Main projects endpoint with comprehensive error handling
app.get('/api/projects', async (req, res) => {
  console.log('\n📋 GET /api/projects called');

  // Read the sortBy and clientName query parameters from the request
  const { sortBy, clientName } = req.query;
  console.log('   Sort parameter:', sortBy || 'default');
  console.log('   Client filter:', clientName || 'none');

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
      // Add client filtering if specified
      if (clientName) {
        selectOptions.filterByFormula = `{Client Name} = "${clientName}"`;
        console.log('   Applied client filter:', selectOptions.filterByFormula);
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
        // Add client filtering if specified
        if (clientName) {
          // Use field ID for filtering if field name doesn't work
          selectOptions.filterByFormula = `{fldz4wyzGjAab2GJR} = "${clientName}"`;
          console.log('   Applied client filter with field ID:', selectOptions.filterByFormula);
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
        tasks: getField('Tasks', 'fld5lb8nCSK4xBPo5', []),
        clientName: getField('Client Name', 'fldz4wyzGjAab2GJR', '')
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

// Files endpoint - get all files from Airtable (simplified to match working Projects pattern)
app.get('/api/files', async (req, res) => {
  console.log('\n📁 GET /api/files called');
  console.log('📁 Request query params:', req.query);

  if (!base) {
    console.error('❌ Airtable not initialized');
    return res.status(503).json({
      error: 'Airtable not configured',
      message: 'The server is running but Airtable is not properly configured'
    });
  }

  const { clientName, sortBy, includeMondabot } = req.query;
  console.log('📁 Extracted params:', { clientName, sortBy, includeMondabot });

  try {
    console.log('🔄 Attempting to fetch files from Airtable...');
    console.log('   Client filter:', clientName || 'none');

    // Use the same filtering approach as Projects endpoint (server-side filtering)
    let records = [];
    try {
      const selectOptions = {
        maxRecords: 100
      };

      // Build filter formula - combine Active field filter with client filter
      let filterFormulas = [];

      // Always filter for Active = true (only show active files)
      filterFormulas.push('{Active} = TRUE()');

      // Add client filtering if specified - use Airtable filterByFormula like Projects
      if (clientName) {
        if (includeMondabot === 'true') {
          // Include both client files and Mondabot files
          filterFormulas.push(`OR(FIND("${clientName}", ARRAYJOIN({Client Name}, ",")) > 0, FIND("Mondabot", ARRAYJOIN({Client Name}, ",")) > 0)`);
        } else {
          // For lookup fields, we need to use FIND() function to search within the array
          filterFormulas.push(`FIND("${clientName}", ARRAYJOIN({Client Name}, ",")) > 0`);
        }
      }

      // Combine filters with AND
      if (filterFormulas.length > 0) {
        selectOptions.filterByFormula = filterFormulas.length > 1
          ? `AND(${filterFormulas.join(', ')})`
          : filterFormulas[0];
        console.log('   Applied combined filter:', selectOptions.filterByFormula);
      }

      records = await base('tblYU4F7eZzvpLDdz').select(selectOptions).all();
      console.log(`✅ Fetched ${records.length} files from Airtable with server-side filtering`);
    } catch (error) {
      console.error('❌ Failed to fetch files:', error.message);
      return res.status(500).json({ error: 'Failed to fetch files from Airtable' });
    }

    console.log(`✅ Successfully fetched ${records.length} file records`);

    // Map records - try both field names and field IDs
    const files = records.map(record => {
      const getField = (fieldName, fieldId, defaultValue = '') => {
        return record.get(fieldName) || record.get(fieldId) || defaultValue;
      };

      const fileName = getField('Document Name', 'fldaW2mM0MQn1txVH', 'Unnamed File');
      const category = getField('Category', 'fldSdtKhX0yTo20oW', 'Other');
      const uploader = getField('Uploader', 'fldyuECEg4bIo6qKx', 'Unknown');
      const clientNameRaw = getField('Client Name', 'flddVpS1iqNTvHKS5', '');
      const fileUrl = getField('File URL', 'fldADv7kvT6PAj3ok', '');
      const notes = getField('Notes', 'fld490y8DoZM2aR8r', '');

      // Debug: Log the raw client name data
      console.log('📁 Raw Client Name data for record:', record.id, {
        clientNameRaw,
        type: typeof clientNameRaw,
        isArray: Array.isArray(clientNameRaw),
        value: clientNameRaw
      });

      // Handle Client Name as lookup field (array)
      let clientName = '';
      if (Array.isArray(clientNameRaw)) {
        // If it's an array, take the first client name for display
        clientName = clientNameRaw.length > 0 ? clientNameRaw[0] : '';
      } else if (typeof clientNameRaw === 'string') {
        clientName = clientNameRaw;
      } else if (clientNameRaw) {
        clientName = String(clientNameRaw);
      }

      // Extract file size and cloudinary ID from notes if available
      const sizeMatch = notes.match(/File size: ([\d.]+\s*MB)/);
      const cloudinaryMatch = notes.match(/Cloudinary ID: ([^,\s]+)/);
      const fileSize = sizeMatch ? sizeMatch[1] : '';
      const cloudinaryId = cloudinaryMatch ? cloudinaryMatch[1] : '';

      return {
        id: record.id,
        name: fileName,
        category: category,
        uploader: uploader,
        clientName: clientName,
        uploadDate: record.get('Upload Date') || record.get('fldIIy0KTQvTFHp10') || new Date().toISOString(),
        size: fileSize,
        downloadUrl: fileUrl,
        cloudinaryId: cloudinaryId,
        fileType: getFileType(fileName)
      };
    });

    console.log(`📁 Returning ${files.length} files for client: ${clientName || 'all'}`);
    if (files.length > 0) {
      console.log('📁 Sample file data:', {
        id: files[0].id,
        name: files[0].name,
        clientName: files[0].clientName,
        uploader: files[0].uploader
      });
    }
    res.json(files);

  } catch (error) {
    console.error('❌ Error fetching files:', error);

    // Return empty array instead of throwing error for now
    if (error.statusCode === 404 || error.statusCode === 422) {
      console.log('📁 Files table not configured properly - returning empty array');
      return res.json([]);
    }

    const errorResponse = {
      error: 'Failed to fetch files',
      message: error.message,
      timestamp: new Date().toISOString()
    };

    // Add specific error context
    if (error.statusCode) {
      errorResponse.statusCode = error.statusCode;

      switch (error.statusCode) {
        case 401:
          errorResponse.help = 'Check your AIRTABLE_API_KEY in .env file';
          break;
        case 404:
          errorResponse.help = 'Files table not found. Create a Files table in Airtable first.';
          break;
        case 422:
          errorResponse.help = 'Files table structure issue. Check field names and types.';
          break;
        case 429:
          errorResponse.help = 'Rate limited. Wait 30 seconds';
          break;
      }
    }

    res.status(error.statusCode || 500).json(errorResponse);
  }
});

// File delete endpoint - sets Active field to false instead of actually deleting
app.delete('/api/files/:fileId', async (req, res) => {
  console.log('\n🗑️ DELETE /api/files/:fileId called');

  if (!base) {
    console.error('❌ Airtable not initialized');
    return res.status(503).json({
      error: 'Airtable not configured',
      message: 'The server is running but Airtable is not properly configured'
    });
  }

  const { fileId } = req.params;
  console.log('📁 File ID to deactivate:', fileId);

  try {
    // Update the record to set Active = false
    let record;
    try {
      // Try with table name first
      record = await base('Files').update(fileId, {
        'Active': false // fldxoZ0bPJVRV7j2H
      });
      console.log('✅ Updated record using table name "Files"');
    } catch (nameError) {
      if (nameError.statusCode === 404) {
        console.log('⚠️  Table name "Files" not found, trying table ID...');
        // Try with the table ID for Files table
        record = await base('tblYU4F7eZzvpLDdz').update(fileId, {
          'Active': false // fldxoZ0bPJVRV7j2H
        });
        console.log('✅ Updated record using table ID');
      } else {
        throw nameError;
      }
    }

    console.log('✅ File deactivated in Airtable:', record.id);

    // Broadcast the update to all connected clients if Socket.IO is available
    if (io) {
      io.emit('files_updated', {
        action: 'deleted',
        file: {
          id: record.id
        }
      });
    }

    res.json({
      success: true,
      message: 'File deleted successfully',
      fileId: record.id
    });

  } catch (error) {
    console.error('❌ File delete error:', error);

    const errorResponse = {
      error: 'Failed to delete file',
      message: error.message,
      timestamp: new Date().toISOString()
    };

    if (error.statusCode) {
      errorResponse.statusCode = error.statusCode;

      switch (error.statusCode) {
        case 401:
          errorResponse.help = 'Check your AIRTABLE_API_KEY in .env file';
          break;
        case 404:
          errorResponse.help = 'File not found or table not accessible';
          break;
        case 422:
          errorResponse.help = 'Invalid file ID or field structure issue';
          break;
        case 429:
          errorResponse.help = 'Rate limited. Wait 30 seconds';
          break;
      }
    }

    res.status(error.statusCode || 500).json(errorResponse);
  }
});

// Helper function to determine file type from filename
function getFileType(filename) {
  if (!filename) return 'other';

  const extension = filename.toLowerCase().split('.').pop();

  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'doc':
    case 'docx':
      return 'word';
    case 'xls':
    case 'xlsx':
      return 'excel';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
      return 'image';
    default:
      return 'other';
  }
}

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Get the file extension
    const fileExtension = file.originalname.split('.').pop() || '';
    const fileName = file.originalname.replace(/\.[^/.]+$/, "");

    // Log file details for debugging
    console.log('📤 Upload file details:', {
      originalName: file.originalname,
      extension: fileExtension,
      baseName: fileName
    });

    // Create a timestamp for uniqueness
    const timestamp = Date.now();

    // Create a clean unique filename WITHOUT extension in public_id
    // This is more reliable for Cloudinary raw resource serving
    const uniqueFileName = `${fileName}_${timestamp}`;

    console.log('📤 Cloudinary upload configuration:', {
      originalName: file.originalname,
      extension: fileExtension,
      uniqueFileName: uniqueFileName,
      publicId: uniqueFileName
    });

    return {
      resource_type: "raw", // Always use raw to preserve the original file format
      folder: "mondabot-files",
      use_filename: false, // Don't use the original filename directly
      unique_filename: false, // We're creating our own unique name
      // IMPORTANT: Do NOT include extension in public_id for raw resources
      // This prevents issues with special characters and content-type headers
      public_id: uniqueFileName,
      // Add access mode to make files publicly accessible
      access_mode: "public",
      // Add type to ensure proper handling
      type: "upload",
      // Add metadata to help with file identification and extension tracking
      context: {
        alt: file.originalname,
        original_filename: file.originalname,
        original_extension: fileExtension,
        file_type: getFileType(file.originalname)
      }
    };
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for free Cloudinary accounts
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/png',
      'image/jpeg',
      'image/jpg'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: PDF, DOC, DOCX, TXT, PNG, JPG`), false);
    }
  }
});

// File upload endpoint
app.post('/api/files/upload', upload.single('file'), async (req, res) => {
  console.log('\n📤 POST /api/files/upload called');

  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a file to upload'
      });
    }

    const { fileName, category, uploader, clientName } = req.body;

    console.log('📁 File upload details:');
    console.log('   Original name:', req.file.originalname);
    console.log('   Cloudinary URL:', req.file.path);
    console.log('   Size:', req.file.size, 'bytes');
    console.log('   Format:', req.file.format);
    console.log('   Public ID:', req.file.filename);
    console.log('   Custom file name:', fileName);
    console.log('   Category:', category);
    console.log('   Uploader:', uploader);
    console.log('   Client:', clientName);

    // Create record in Airtable
    if (base) {
      // First, we need to find the Client record ID for this client name
      let clientRecordId = null;
      if (clientName) {
        try {
          const clientRecords = await base('Clients').select({
            filterByFormula: `{Name} = "${clientName}"`
          }).all();

          if (clientRecords.length > 0) {
            clientRecordId = clientRecords[0].id;
            console.log('✅ Found client record:', clientRecordId);
          } else {
            console.log('⚠️  Client record not found for:', clientName);
          }
        } catch (clientError) {
          console.log('⚠️  Could not fetch client records:', clientError.message);
        }
      }

      // Ensure the document name always includes the proper file extension
      const fileExtension = req.file.originalname.split('.').pop() || '';
      let documentName = fileName || req.file.originalname;
      
      // If the user provided a custom name but it doesn't have the extension, add it
      if (fileName && fileExtension && !fileName.toLowerCase().endsWith(`.${fileExtension.toLowerCase()}`)) {
        documentName = `${fileName}.${fileExtension}`;
      }

      const recordData = {
        'Document Name': documentName, // fldaW2mM0MQn1txVH - Always includes extension
        'Category': category || 'Other', // fldSdtKhX0yTo20oW
        'Uploader': uploader || 'Unknown', // fldyuECEg4bIo6qKx
        'File URL': req.file.path, // fldADv7kvT6PAj3ok
        'Notes': `File size: ${(req.file.size / 1024 / 1024).toFixed(2)} MB, Cloudinary ID: ${req.file.filename}`, // fld490y8DoZM2aR8r
        'Active': true // fldxoZ0bPJVRV7j2H - Set to true by default for new files
      };

      // Add client link if we found the record
      if (clientRecordId) {
        recordData['Client'] = [clientRecordId]; // fldcC7lYh36te1iXO
      }

      console.log('💾 Creating Airtable record:', recordData);

      try {
        // Try with table name first
        let record;
        try {
          record = await base('Files').create(recordData, { typecast: true });
          console.log('✅ Created record using table name "Files"');
        } catch (nameError) {
          if (nameError.statusCode === 404) {
            console.log('⚠️  Table name "Files" not found, trying table ID...');
            // Try with the table ID for Files table
            record = await base('tblYU4F7eZzvpLDdz').create(recordData, { typecast: true });
            console.log('✅ Created record using table ID');
          } else {
            throw nameError;
          }
        }

        console.log('✅ File record created in Airtable:', record.id);

        // Broadcast the update to all connected clients if Socket.IO is available
        if (io) {
          io.emit('files_updated', {
            action: 'created',
            file: {
              id: record.id,
              name: documentName, // Use the document name with extension
              category: category || 'Other',
              uploader: uploader || 'Unknown',
              clientName: clientName || '',
              uploadDate: new Date().toISOString(),
              size: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
              downloadUrl: req.file.path,
              cloudinaryId: req.file.filename,
              fileType: getFileType(documentName)
            }
          });
        }

      } catch (airtableError) {
        console.error('❌ Failed to create Airtable record:', airtableError);
        // Don't fail the upload if Airtable fails, just log it
      }
    }

    // Get the file extension for proper download handling
    const fileExtension = req.file.originalname.split('.').pop() || '';
    
    // Use the same document name logic as we used for Airtable storage
    let displayFileName = fileName || req.file.originalname;
    if (fileName && fileExtension && !fileName.toLowerCase().endsWith(`.${fileExtension.toLowerCase()}`)) {
      displayFileName = `${fileName}.${fileExtension}`;
    }

    // For raw resources without extension in public_id, we need to construct the download URL properly
    // Cloudinary will serve the file correctly, but we need to ensure proper filename on download
    let downloadUrl = req.file.path;

    // Use Cloudinary's dl parameter which is specifically for download filename
    const separator = downloadUrl.includes('?') ? '&' : '?';
    downloadUrl = `${downloadUrl}${separator}dl=${encodeURIComponent(displayFileName)}`;

    // Log the download URL for debugging
    console.log('📁 Download URL:', {
      originalPath: req.file.path,
      finalDownloadUrl: downloadUrl,
      displayFileName,
      fileExtension
    });

    // Return success response
    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: req.file.filename,
        name: displayFileName,
        category: category || 'Other',
        uploader: uploader || 'Unknown',
        clientName: clientName || '',
        uploadDate: new Date().toISOString(),
        size: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
        downloadUrl: downloadUrl,
        cloudinaryId: req.file.filename,
        fileType: getFileType(displayFileName)
      }
    });

  } catch (error) {
    console.error('❌ File upload error:', error);

    res.status(500).json({
      error: 'File upload failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
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
      tasks: getField('Tasks', 'fld5lb8nCSK4xBPo5', []),
      clientName: getField('Client Name', 'fldz4wyzGjAab2GJR', '')
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

  // In Railway, the Next.js build should be in the same directory structure
  const nextAppPath = path.join(__dirname, '..', 'mondabot-dashboard');
  const nextBuildPath = path.join(nextAppPath, '.next');

  console.log('🔍 Checking Next.js build...');
  console.log(`   Next.js app path: ${nextAppPath}`);
  console.log(`   Next.js build path: ${nextBuildPath}`);

  // Check if Next.js build exists
  const fs = require('fs');
  const nextBuildExists = fs.existsSync(nextBuildPath);
  console.log(`   Next.js build exists: ${nextBuildExists ? '✅ Yes' : '❌ No'}`);

  if (!nextBuildExists) {
    console.log('⚠️  Next.js build not found. Serving API-only mode...');
    console.log('   Frontend routes will return 404. This is expected for API-only deployment.');

    // Add a helpful message for frontend routes
    app.get('*', (req, res) => {
      // Skip API routes - they should be handled by Express
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({
          error: 'API route not found',
          message: `API route ${req.method} ${req.path} does not exist`
        });
      }

      // For frontend routes, return a helpful message
      res.status(200).json({
        message: 'Mondabot Dashboard API Server',
        status: 'running',
        mode: 'api-only',
        note: 'Frontend not available in this deployment configuration',
        availableEndpoints: [
          'GET /health - Server health check',
          'GET /api/debug - Debug information',
          'GET /api/projects - Fetch projects from Airtable',
          'GET /api/tasks - Fetch tasks from Airtable'
        ],
        timestamp: new Date().toISOString()
      });
    });

    startServer();
    return;
  }

  // Check if Next.js is available
  let nextModule;
  try {
    nextModule = require('next');
    console.log('✅ Next.js module loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load Next.js module:', error.message);
    console.error('   This is likely a dependency issue. Next.js should be installed in server/package.json');
    console.error('   Falling back to API-only mode...');

    // Fallback to API-only mode
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({
          error: 'API route not found',
          message: `API route ${req.method} ${req.path} does not exist`
        });
      }

      res.status(200).json({
        message: 'Mondabot Dashboard API Server',
        status: 'running',
        mode: 'api-only',
        note: 'Next.js module not available',
        availableEndpoints: [
          'GET /health - Server health check',
          'GET /api/debug - Debug information',
          'GET /api/projects - Fetch projects from Airtable',
          'GET /api/tasks - Fetch tasks from Airtable'
        ],
        timestamp: new Date().toISOString()
      });
    });

    startServer();
    return;
  }

  // Use proper Next.js initialization
  const dev = false;
  const nextApp = nextModule({
    dev,
    dir: nextAppPath, // Points to the 'mondabot-dashboard' directory
    conf: {
      distDir: '.next'
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
      console.log(`🎨 Serving Next.js route: ${req.method} ${req.path}`);
      console.log(`Middleware processing: {`);
      console.log(`  url: '${req.protocol}://${req.get('host')}${req.originalUrl}',`);
      console.log(`  authEnabled: ${process.env.NEXT_PUBLIC_ENABLE_AUTHENTICATION === 'true'},`);
      console.log(`  host: '${req.get('host')}',`);
      console.log(`  userAgent: '${req.get('user-agent')}'`);
      console.log(`}`);

      return handle(req, res);
    });

    // Start server after Next.js is ready
    startServer();
  }).catch(err => {
    console.error('❌ Error preparing Next.js app:', err);
    console.error('   Falling back to API-only mode...');

    // Fallback to API-only mode
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({
          error: 'API route not found',
          message: `API route ${req.method} ${req.path} does not exist`
        });
      }

      res.status(200).json({
        message: 'Mondabot Dashboard API Server',
        status: 'running',
        mode: 'api-only',
        note: 'Next.js initialization failed',
        error: err.message,
        availableEndpoints: [
          'GET /health - Server health check',
          'GET /api/debug - Debug information',
          'GET /api/projects - Fetch projects from Airtable',
          'GET /api/tasks - Fetch tasks from Airtable'
        ],
        timestamp: new Date().toISOString()
      });
    });

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
    const errorPort = process.env.PORT || process.env.API_PORT || 3001;
    console.error(`\n❌ Port ${errorPort} is already in use!`);
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