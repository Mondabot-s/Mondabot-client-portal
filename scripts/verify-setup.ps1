# Verification script to check if the Mondabot Dashboard setup is working correctly

Write-Host "🔍 Mondabot Dashboard Setup Verification" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

$errors = @()
$warnings = @()

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Not in the project root directory" -ForegroundColor Red
    Write-Host "📍 Please navigate to the mondabot-dashboard folder" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ In correct project directory" -ForegroundColor Green

# Check Node.js version
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    
    if ($nodeVersion -match "v(\d+)\.") {
        $majorVersion = [int]$matches[1]
        if ($majorVersion -lt 18) {
            $warnings += "Node.js version is below 18. Consider upgrading for best compatibility."
        }
    }
} catch {
    $errors += "Node.js is not installed or not in PATH"
}

# Check npm version
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    $errors += "npm is not installed or not in PATH"
}

# Check project structure
$requiredDirs = @("server", "mondabot-dashboard", "scripts")
foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Write-Host "✅ Found $dir directory" -ForegroundColor Green
    } else {
        $errors += "Missing required directory: $dir"
    }
}

# Check package.json files
$packageFiles = @("package.json", "server/package.json", "mondabot-dashboard/package.json")
foreach ($file in $packageFiles) {
    if (Test-Path $file) {
        Write-Host "✅ Found $file" -ForegroundColor Green
    } else {
        $errors += "Missing required file: $file"
    }
}

# Check dependencies
Write-Host ""
Write-Host "📦 Checking Dependencies..." -ForegroundColor Yellow

$dependencyDirs = @("node_modules", "server/node_modules", "mondabot-dashboard/node_modules")
foreach ($dir in $dependencyDirs) {
    if (Test-Path $dir) {
        Write-Host "✅ Dependencies installed: $dir" -ForegroundColor Green
    } else {
        $warnings += "Dependencies not installed in $dir. Run 'npm run setup' to install."
    }
}

# Check environment configuration
Write-Host ""
Write-Host "🔧 Checking Environment Configuration..." -ForegroundColor Yellow

if (Test-Path "server/.env") {
    Write-Host "✅ Environment file exists: server/.env" -ForegroundColor Green
    
    $envContent = Get-Content "server/.env" -Raw
    
    if ($envContent -match "AIRTABLE_API_KEY=pat\w+") {
        Write-Host "✅ Airtable API key configured" -ForegroundColor Green
    } elseif ($envContent -match "AIRTABLE_API_KEY=\w+") {
        $warnings += "Airtable API key may not be valid (should start with 'pat')"
    } else {
        $warnings += "Airtable API key not configured in server/.env"
    }
    
    if ($envContent -match "AIRTABLE_BASE_ID=app\w+") {
        Write-Host "✅ Airtable Base ID configured" -ForegroundColor Green
    } elseif ($envContent -match "AIRTABLE_BASE_ID=\w+") {
        $warnings += "Airtable Base ID may not be valid (should start with 'app')"
    } else {
        $warnings += "Airtable Base ID not configured in server/.env"
    }
} else {
    $warnings += "Environment file not found: server/.env"
}

# Check port availability
Write-Host ""
Write-Host "🌐 Checking Port Availability..." -ForegroundColor Yellow

function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

$ports = @(3000, 3001)
foreach ($port in $ports) {
    if (Test-Port -Port $port) {
        $warnings += "Port $port is currently in use. You may need to stop existing processes."
    } else {
        Write-Host "✅ Port $port is available" -ForegroundColor Green
    }
}

# Check configuration files
Write-Host ""
Write-Host "⚙️  Checking Configuration Files..." -ForegroundColor Yellow

if (Test-Path "mondabot-dashboard/next.config.ts") {
    $nextConfig = Get-Content "mondabot-dashboard/next.config.ts" -Raw
    if ($nextConfig -match "localhost:3001") {
        Write-Host "✅ Next.js proxy configured correctly" -ForegroundColor Green
    } else {
        $errors += "Next.js proxy configuration may be incorrect"
    }
} else {
    $errors += "Next.js configuration file not found"
}

# Test server health (if running)
Write-Host ""
Write-Host "🏥 Testing Server Health..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 3 -ErrorAction Stop
    Write-Host "✅ Backend server is running and healthy" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  Backend server is not currently running (this is normal if not started)" -ForegroundColor Gray
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 3 -ErrorAction Stop
    Write-Host "✅ Frontend server is running" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  Frontend server is not currently running (this is normal if not started)" -ForegroundColor Gray
}

# Summary
Write-Host ""
Write-Host "📊 Setup Verification Summary" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "🎉 Perfect! Your setup is ready to go!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 To start development:" -ForegroundColor White
    Write-Host "   • Run: .\scripts\start-dev.ps1" -ForegroundColor Cyan
    Write-Host "   • Or: npm run dev:windows" -ForegroundColor Cyan
} elseif ($errors.Count -eq 0) {
    Write-Host "✅ Setup is functional with minor warnings" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🚀 You can start development:" -ForegroundColor White
    Write-Host "   • Run: .\scripts\start-dev.ps1" -ForegroundColor Cyan
    Write-Host "   • Or: npm run dev:windows" -ForegroundColor Cyan
} else {
    Write-Host "❌ Setup has issues that need to be resolved" -ForegroundColor Red
}

if ($errors.Count -gt 0) {
    Write-Host ""
    Write-Host "🔴 Errors (must fix):" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "   • $error" -ForegroundColor Red
    }
}

if ($warnings.Count -gt 0) {
    Write-Host ""
    Write-Host "🟡 Warnings (recommended to fix):" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "   • $warning" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "💡 Quick Fixes:" -ForegroundColor Cyan
Write-Host "   • Install dependencies: npm run setup" -ForegroundColor White
Write-Host "   • Clean install: .\scripts\start-dev.ps1 -Clean" -ForegroundColor White
Write-Host "   • Force restart: .\scripts\start-dev.ps1 -Force" -ForegroundColor White
Write-Host "   • Check server health: npm run health" -ForegroundColor White
Write-Host "" 