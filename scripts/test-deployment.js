const http = require('http');
const https = require('https');

async function testEndpoint(url, description) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    console.log(`\n🧪 Testing: ${description}`);
    console.log(`   URL: ${url}`);
    
    const request = client.get(url, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Content-Type: ${res.headers['content-type']}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`   ✅ SUCCESS`);
          
          // Additional validation for JSON responses
          if (res.headers['content-type']?.includes('application/json')) {
            try {
              const json = JSON.parse(data);
              console.log(`   📊 Response: ${JSON.stringify(json, null, 2).substring(0, 200)}${data.length > 200 ? '...' : ''}`);
            } catch (e) {
              console.log(`   ⚠️  Invalid JSON response`);
            }
          }
        } else {
          console.log(`   ❌ FAILED - Status: ${res.statusCode}`);
          if (data) {
            console.log(`   📄 Response: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
          }
        }
        resolve({ success: res.statusCode === 200, status: res.statusCode, contentType: res.headers['content-type'] });
      });
    });
    
    request.on('error', (err) => {
      console.log(`   ❌ ERROR: ${err.message}`);
      resolve({ success: false, error: err.message });
    });
    
    request.setTimeout(10000, () => {
      console.log(`   ⏱️  TIMEOUT: Request timed out`);
      request.abort();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

async function runTests() {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction 
    ? process.env.FRONTEND_URL || 'http://localhost:3000'
    : 'http://localhost:3000';
  
  console.log('🔍 Mondabot Dashboard Deployment Test\n');
  console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Backend URL: http://localhost:3001`);
  console.log(`Time: ${new Date().toISOString()}`);
  
  const tests = [
    { url: `http://localhost:3001/health`, description: 'Backend Direct Health Check' },
    { url: `http://localhost:3001/api/health`, description: 'Backend API Health Check' },
    { url: `http://localhost:3001/api/debug`, description: 'Backend Debug Info' },
    { url: `${baseUrl}/api/health`, description: 'Frontend Proxied API Health Check' },
    { url: `${baseUrl}/`, description: 'Frontend Homepage' },
  ];
  
  // Additional tests for production
  if (isProduction) {
    tests.push(
      { url: `${baseUrl}/_next/static/chunks/main.js`, description: 'Static JS File' },
      { url: `${baseUrl}/_next/static/css/app.css`, description: 'Static CSS File' }
    );
  }
  
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.url, test.description);
    results.push({ ...test, ...result });
  }
  
  console.log('\n📊 Test Summary');
  console.log('================');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${results.length}`);
  
  if (failed > 0) {
    console.log('\n🔍 Failed Tests:');
    results.filter(r => !r.success).forEach(test => {
      console.log(`   ❌ ${test.description}: ${test.error || `Status ${test.status}`}`);
    });
  }
  
  console.log('\n🎯 Recommendations:');
  
  const backendTests = results.filter(r => r.url.includes('localhost:3001'));
  const frontendTests = results.filter(r => r.url.includes('localhost:3000'));
  
  if (backendTests.some(r => !r.success)) {
    console.log('   🔧 Backend Issues Detected:');
    console.log('      - Ensure backend server is running on port 3001');
    console.log('      - Check server logs for errors');
    console.log('      - Verify environment variables in server/.env');
    console.log('      - Run: cd server && npm run dev');
  }
  
  if (frontendTests.some(r => !r.success)) {
    console.log('   🎨 Frontend Issues Detected:');
    console.log('      - Ensure frontend server is running on port 3000');
    console.log('      - Check Next.js proxy configuration');
    console.log('      - Verify no build errors');
    console.log('      - Run: cd mondabot-dashboard && npm run dev');
  }
  
  const healthCheckPassed = results.some(r => r.description.includes('Health Check') && r.success);
  
  if (healthCheckPassed) {
    console.log('\n✅ DEPLOYMENT HEALTH: GOOD');
    console.log('   Dashboard should be accessible and functional');
  } else {
    console.log('\n❌ DEPLOYMENT HEALTH: ISSUES DETECTED');
    console.log('   Dashboard may not load properly');
  }
  
  console.log('\n🔗 Quick Access Links:');
  console.log(`   🌐 Dashboard: ${baseUrl}`);
  console.log(`   📊 Backend Health: http://localhost:3001/health`);
  console.log(`   🔧 Backend Debug: http://localhost:3001/api/debug`);
  
  console.log('\n✅ Test Complete!\n');
  
  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
}); 