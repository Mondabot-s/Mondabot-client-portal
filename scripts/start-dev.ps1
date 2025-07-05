# Enhanced PowerShell Development Startup Script
# Handles port conflicts, dependencies, and proper server startup

param(
    [switch]$Force,
    [switch]$Clean
)

Write-Host "Starting Mondabot Dashboard Development Setup" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Check if we're in the correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: Run this script from the project root directory" -ForegroundColor Red
    Write-Host "Navigate to the mondabot-dashboard folder first" -ForegroundColor Yellow
    exit 1
}

# Function to check if port is in use
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

# Function to kill processes on specific ports
function Stop-PortProcesses {
    param([int]$Port)
    
    Write-Host "Checking for processes on port $Port..." -ForegroundColor Yellow
    
    try {
        $processes = netstat -ano | Select-String ":$Port " | ForEach-Object {
            ($_ -split '\s+')[-1]
        } | Sort-Object -Unique
        
        foreach ($pid in $processes) {
            if ($pid -and $pid -ne "0") {
                Write-Host "Stopping process $pid on port $Port" -ForegroundColor Red
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                Start-Sleep -Seconds 1
            }
        }
    } catch {
        Write-Host "Could not check/stop processes on port $Port" -ForegroundColor Yellow
    }
}

# Clean install if requested
if ($Clean) {
    Write-Host "Performing clean installation..." -ForegroundColor Yellow
    
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
    if (Test-Path "server/node_modules") { Remove-Item -Recurse -Force "server/node_modules" }
    if (Test-Path "mondabot-dashboard/node_modules") { Remove-Item -Recurse -Force "mondabot-dashboard/node_modules" }
    if (Test-Path "mondabot-dashboard/.next") { Remove-Item -Recurse -Force "mondabot-dashboard/.next" }
    
    Write-Host "Cleaned all dependencies and build files" -ForegroundColor Green
}

# Stop existing processes if Force is used
if ($Force) {
    Write-Host "Force mode: Stopping existing processes..." -ForegroundColor Yellow
    Stop-PortProcesses -Port 3000
    Stop-PortProcesses -Port 3001
    Start-Sleep -Seconds 2
}

# Check for port conflicts
$port3000InUse = Test-Port -Port 3000
$port3001InUse = Test-Port -Port 3001

if ($port3000InUse -or $port3001InUse) {
    Write-Host "Port conflicts detected:" -ForegroundColor Yellow
    if ($port3000InUse) { Write-Host "  • Port 3000 is in use (Frontend)" -ForegroundColor Red }
    if ($port3001InUse) { Write-Host "  • Port 3001 is in use (Backend)" -ForegroundColor Red }
    Write-Host ""
    Write-Host "Solutions:" -ForegroundColor Cyan
    Write-Host "  1. Run with -Force to stop existing processes: .\scripts\start-dev.ps1 -Force" -ForegroundColor White
    Write-Host "  2. Manually stop the processes using Task Manager" -ForegroundColor White
    Write-Host "  3. Use different ports by modifying the configuration" -ForegroundColor White
    
    if (-not $Force) {
        exit 1
    }
}

# Install dependencies
Write-Host "Checking and installing dependencies..." -ForegroundColor Yellow

# Root dependencies
if (-not (Test-Path "node_modules") -or $Clean) {
    Write-Host "  Installing root dependencies..." -ForegroundColor Gray
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install root dependencies" -ForegroundColor Red
        exit 1
    }
}

# Server dependencies
if (-not (Test-Path "server/node_modules") -or $Clean) {
    Write-Host "  Installing server dependencies..." -ForegroundColor Gray
    Push-Location server
    npm install
    $serverInstallResult = $LASTEXITCODE
    Pop-Location
    
    if ($serverInstallResult -ne 0) {
        Write-Host "Failed to install server dependencies" -ForegroundColor Red
        exit 1
    }
}

# Frontend dependencies
if (-not (Test-Path "mondabot-dashboard/node_modules") -or $Clean) {
    Write-Host "  Installing frontend dependencies..." -ForegroundColor Gray
    Push-Location mondabot-dashboard
    npm install
    $frontendInstallResult = $LASTEXITCODE
    Pop-Location
    
    if ($frontendInstallResult -ne 0) {
        Write-Host "Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
}

Write-Host "All dependencies installed successfully" -ForegroundColor Green

# Check environment variables
Write-Host "Checking environment configuration..." -ForegroundColor Yellow

if (Test-Path "server/.env") {
    $envContent = Get-Content "server/.env" -Raw
    $hasApiKey = $envContent -match "AIRTABLE_API_KEY=\w+"
    $hasBaseId = $envContent -match "AIRTABLE_BASE_ID=\w+"
    
    if ($hasApiKey -and $hasBaseId) {
        Write-Host "Environment variables configured" -ForegroundColor Green
    } else {
        Write-Host "Missing Airtable credentials in server/.env" -ForegroundColor Yellow
        Write-Host "  The app will run but may show test data only" -ForegroundColor Gray
    }
} else {
    Write-Host "No .env file found in server directory" -ForegroundColor Yellow
    Write-Host "  Creating basic .env file..." -ForegroundColor Gray
    @"
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
PORT=3001
"@ | Out-File -FilePath "server/.env" -Encoding UTF8
    Write-Host "Created server/.env template - please add your credentials" -ForegroundColor Green
}

# Start servers
Write-Host ""
Write-Host "Starting development servers..." -ForegroundColor Green

# Function to start server in new window
function Start-Server {
    param(
        [string]$Title,
        [string]$Command,
        [string]$WorkingDirectory,
        [string]$Color = "White"
    )
    
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = "powershell.exe"
    $startInfo.Arguments = "-NoExit -Command `"cd '$WorkingDirectory'; Write-Host 'Starting $Title...' -ForegroundColor $Color; $Command`""
    $startInfo.UseShellExecute = $true
    $startInfo.WindowStyle = "Normal"
    
    Write-Host "Starting $Title..." -ForegroundColor Yellow
    [System.Diagnostics.Process]::Start($startInfo) | Out-Null
}

# Start backend server
Start-Server -Title "Backend Server (Port 3001)" -Command "npm run dev" -WorkingDirectory "$PWD\server" -Color "Blue"

# Wait for backend to start
Write-Host "Waiting for backend server to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Start frontend server  
Start-Server -Title "Frontend Server (Port 3000)" -Command "npm run dev" -WorkingDirectory "$PWD\mondabot-dashboard" -Color "Green"

# Final instructions
Write-Host ""
Write-Host "Development servers are starting!" -ForegroundColor Green
Write-Host "Two PowerShell windows will open:" -ForegroundColor Cyan
Write-Host "  • Backend Server (Blue) - Port 3001" -ForegroundColor Blue
Write-Host "  • Frontend Server (Green) - Port 3000" -ForegroundColor Green
Write-Host ""
Write-Host "Access your application at:" -ForegroundColor White
Write-Host "  • Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  • Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host "  • Health:   http://localhost:3001/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  • Check server health: npm run health" -ForegroundColor Gray
Write-Host "  • Restart with clean install: .\scripts\start-dev.ps1 -Clean" -ForegroundColor Gray
Write-Host "  • Force restart: .\scripts\start-dev.ps1 -Force" -ForegroundColor Gray
Write-Host ""
Write-Host "Notes:" -ForegroundColor Yellow
Write-Host "  • Keep both PowerShell windows open while developing" -ForegroundColor Gray
Write-Host "  • Changes to code will auto-reload both servers" -ForegroundColor Gray
Write-Host "  • Check the server windows for error messages" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit this script (servers will continue)..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 