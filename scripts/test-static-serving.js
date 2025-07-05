#!/usr/bin/env node

/**
 * Test Static File Serving
 * 
 * This script tests if the production static file serving works correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Static File Serving Configuration...\n');

// Test 1: Check if Next.js build artifacts exist
console.log('📋 Step 1: Checking Next.js build artifacts...');

const buildPaths = [
  'mondabot-dashboard/.next/server/app/index.html',
  'mondabot-dashboard/.next/static',
  'mondabot-dashboard/.next/standalone'
];

let allFilesExist = true;
buildPaths.forEach(buildPath => {
  const fullPath = path.resolve(buildPath);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✅ ${buildPath}`);
  } else {
    console.log(`   ❌ ${buildPath} - MISSING!`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some build artifacts are missing. Run "npm run build" first.');
  process.exit(1);
}

// Test 2: Check static file structure
console.log('\n📋 Step 2: Checking static file structure...');

const staticDir = path.resolve('mondabot-dashboard/.next/static');
if (fs.existsSync(staticDir)) {
  const staticFiles = fs.readdirSync(staticDir);
  console.log(`   ✅ Static directory has ${staticFiles.length} items`);
  
  // Look for JavaScript chunks
  const jsFiles = staticFiles.filter(file => file.includes('.js') || fs.existsSync(path.join(staticDir, file, 'chunks')));
  console.log(`   ✅ Found ${jsFiles.length} JS-related items`);
} else {
  console.log('   ❌ Static directory not found');
  process.exit(1);
}

// Test 3: Check HTML content
console.log('\n📋 Step 3: Checking HTML content...');

const htmlPath = path.resolve('mondabot-dashboard/.next/server/app/index.html');
if (fs.existsSync(htmlPath)) {
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  // Check for essential elements
  const checks = [
    { name: 'DOCTYPE', pattern: /<!DOCTYPE html>/i },
    { name: 'Next.js scripts', pattern: /_next\/static/i },
    { name: 'Root div', pattern: /<div id="__next">/i },
    { name: 'Meta viewport', pattern: /<meta name="viewport"/i }
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(htmlContent)) {
      console.log(`   ✅ ${check.name} found`);
    } else {
      console.log(`   ⚠️  ${check.name} not found`);
    }
  });
  
  console.log(`   ✅ HTML file size: ${(htmlContent.length / 1024).toFixed(1)}KB`);
} else {
  console.log('   ❌ HTML file not found');
  process.exit(1);
}

console.log('\n🎉 Static file serving configuration looks good!');
console.log('\n📋 Next steps:');
console.log('   1. Deploy to Railway');
console.log('   2. Check Railway logs for any static file issues');
console.log('   3. Test the deployed app in a browser'); 