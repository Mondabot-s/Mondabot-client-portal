#!/usr/bin/env node

/**
 * Railway Build Test Script
 * 
 * This script simulates the Railway build process locally to catch issues
 * before deploying to Railway. It maintains the dual-server architecture.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Testing Railway Build Process Locally...\n');

// Test 1: Check if required files exist
console.log('📋 Step 1: Checking required files...');
const requiredFiles = [
  'Dockerfile',
  'railway.json',
  'package.json',
  'mondabot-dashboard/package.json',
  'server/package.json',
  'mondabot-dashboard/next.config.ts'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING!`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Fix these before deploying.');
  process.exit(1);
}

// Test 2: Check Next.js configuration
console.log('\n📋 Step 2: Checking Next.js configuration...');
try {
  const nextConfig = fs.readFileSync('mondabot-dashboard/next.config.ts', 'utf8');
  if (nextConfig.includes("output: 'standalone'")) {
    console.log('   ✅ Next.js configured for standalone output');
  } else {
    console.log('   ❌ Next.js not configured for standalone output');
    process.exit(1);
  }
  
  if (nextConfig.includes("output: 'export'")) {
    console.log('   ❌ FORBIDDEN: Static export detected! This breaks the architecture.');
    process.exit(1);
  }
} catch (error) {
  console.log('   ❌ Could not read Next.js config:', error.message);
  process.exit(1);
}

// Test 3: Check package.json scripts
console.log('\n📋 Step 3: Checking Railway scripts...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['railway:build', 'railway:start', 'start:api', 'start:web'];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts[script]) {
      console.log(`   ✅ ${script}: ${packageJson.scripts[script]}`);
    } else {
      console.log(`   ❌ Missing script: ${script}`);
      process.exit(1);
    }
  });
} catch (error) {
  console.log('   ❌ Could not read package.json:', error.message);
  process.exit(1);
}

// Test 4: Test build process
console.log('\n📋 Step 4: Testing build process...');
console.log('   Running: npm run railway:build');

const buildProcess = spawn('npm', ['run', 'railway:build'], {
  stdio: 'inherit',
  shell: true
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Build process completed successfully!');
    
    // Test 5: Check if build artifacts exist
    console.log('\n📋 Step 5: Checking build artifacts...');
    const buildArtifacts = [
      'mondabot-dashboard/.next',
      'mondabot-dashboard/.next/standalone',
      'mondabot-dashboard/.next/static'
    ];
    
    let allArtifactsExist = true;
    buildArtifacts.forEach(artifact => {
      if (fs.existsSync(artifact)) {
        console.log(`   ✅ ${artifact}`);
      } else {
        console.log(`   ❌ ${artifact} - Build artifact missing!`);
        allArtifactsExist = false;
      }
    });
    
    if (allArtifactsExist) {
      console.log('\n🎉 All tests passed! Your project is ready for Railway deployment.');
      console.log('\n📋 Next steps:');
      console.log('   1. Push your changes to GitHub');
      console.log('   2. Deploy to Railway');
      console.log('   3. Set environment variables in Railway dashboard');
      console.log('   4. Monitor the deployment logs');
    } else {
      console.log('\n❌ Build artifacts are missing. Check the build process.');
      process.exit(1);
    }
  } else {
    console.log(`\n❌ Build process failed with code ${code}`);
    process.exit(1);
  }
});

buildProcess.on('error', (error) => {
  console.log('\n❌ Build process error:', error.message);
  process.exit(1);
}); 