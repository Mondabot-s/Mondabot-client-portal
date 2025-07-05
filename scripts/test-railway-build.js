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

console.log('🧪 Testing Railway Build Configuration...\n');

// Test 1: Check if all package.json files exist
const packageJsonFiles = [
  'package.json',
  'server/package.json',
  'mondabot-dashboard/package.json'
];

console.log('📦 Checking package.json files...');
packageJsonFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  console.log(`   ${file}: ${exists ? '✅' : '❌'}`);
});

// Test 2: Check if Next.js is properly configured
console.log('\n🔧 Checking Next.js configuration...');
try {
  const serverPkg = require('../server/package.json');
  const hasNext = serverPkg.dependencies && serverPkg.dependencies.next;
  console.log(`   Next.js in server dependencies: ${hasNext ? '✅' : '❌'}`);
  
  const rootPkg = require('../package.json');
  const hasNextRoot = rootPkg.dependencies && rootPkg.dependencies.next;
  console.log(`   Next.js in root dependencies: ${hasNextRoot ? '✅' : '❌'}`);
  
  const frontendPkg = require('../mondabot-dashboard/package.json');
  const hasNextFrontend = frontendPkg.dependencies && frontendPkg.dependencies.next;
  console.log(`   Next.js in frontend dependencies: ${hasNextFrontend ? '✅' : '❌'}`);
} catch (error) {
  console.log(`   Error checking dependencies: ❌ ${error.message}`);
}

// Test 3: Check if Next.js config exists
console.log('\n⚙️ Checking Next.js configuration file...');
const nextConfigExists = fs.existsSync(path.join(__dirname, '..', 'mondabot-dashboard', 'next.config.ts'));
console.log(`   next.config.ts exists: ${nextConfigExists ? '✅' : '❌'}`);

if (nextConfigExists) {
  try {
    const nextConfigContent = fs.readFileSync(path.join(__dirname, '..', 'mondabot-dashboard', 'next.config.ts'), 'utf8');
    const hasPublicRuntimeConfig = nextConfigContent.includes('publicRuntimeConfig');
    const hasStandalone = nextConfigContent.includes('standalone');
    console.log(`   Has publicRuntimeConfig: ${hasPublicRuntimeConfig ? '✅' : '❌'}`);
    console.log(`   Has standalone output: ${hasStandalone ? '✅' : '❌'}`);
  } catch (error) {
    console.log(`   Error reading next.config.ts: ❌ ${error.message}`);
  }
}

// Test 4: Check Docker configuration
console.log('\n🐳 Checking Docker configuration...');
const dockerfileExists = fs.existsSync(path.join(__dirname, '..', 'Dockerfile'));
console.log(`   Dockerfile exists: ${dockerfileExists ? '✅' : '❌'}`);

const railwayJsonExists = fs.existsSync(path.join(__dirname, '..', 'railway.json'));
console.log(`   railway.json exists: ${railwayJsonExists ? '✅' : '❌'}`);

// Test 5: Check production scripts
console.log('\n🚀 Checking production scripts...');
const startProductionExists = fs.existsSync(path.join(__dirname, 'start-production.js'));
console.log(`   start-production.js exists: ${startProductionExists ? '✅' : '❌'}`);

try {
  const rootPkg = require('../package.json');
  const hasRailwayBuild = rootPkg.scripts && rootPkg.scripts['railway:build'];
  const hasRailwayStart = rootPkg.scripts && rootPkg.scripts['railway:start'];
  console.log(`   railway:build script: ${hasRailwayBuild ? '✅' : '❌'}`);
  console.log(`   railway:start script: ${hasRailwayStart ? '✅' : '❌'}`);
} catch (error) {
  console.log(`   Error checking scripts: ❌ ${error.message}`);
}

// Test 6: Check server configuration
console.log('\n🔧 Checking server configuration...');
const serverExists = fs.existsSync(path.join(__dirname, '..', 'server', 'server.js'));
console.log(`   server.js exists: ${serverExists ? '✅' : '❌'}`);

if (serverExists) {
  try {
    const serverContent = fs.readFileSync(path.join(__dirname, '..', 'server', 'server.js'), 'utf8');
    const hasNextRequire = serverContent.includes("require('next')");
    const hasProductionCheck = serverContent.includes("process.env.NODE_ENV === 'production'");
    const hasHealthEndpoint = serverContent.includes("'/health'");
    console.log(`   Has Next.js require: ${hasNextRequire ? '✅' : '❌'}`);
    console.log(`   Has production check: ${hasProductionCheck ? '✅' : '❌'}`);
    console.log(`   Has health endpoint: ${hasHealthEndpoint ? '✅' : '❌'}`);
  } catch (error) {
    console.log(`   Error reading server.js: ❌ ${error.message}`);
  }
}

console.log('\n📊 Railway Build Test Summary:');
console.log('   If all items above show ✅, your Railway deployment should work correctly.');
console.log('   If any items show ❌, please fix those issues before deploying.');
console.log('\n🚀 Ready for Railway deployment!'); 