# 🔧 Environment Setup Script

Write-Host "🐾 Pet Feeder IoT System - Environment Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit
}

Write-Host ""

# Backend setup
Write-Host "📦 Setting up Backend..." -ForegroundColor Yellow
Set-Location -Path "backend"

if (Test-Path "package.json") {
    Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend installation failed" -ForegroundColor Red
    }
    
    # Create .env file if it doesn't exist
    if (-not (Test-Path ".env")) {
        Write-Host "Creating .env file..." -ForegroundColor Cyan
        Copy-Item ".env.example" ".env"
        Write-Host "⚠️  Please configure your .env file with MongoDB credentials!" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Backend package.json not found" -ForegroundColor Red
}

Set-Location -Path ".."
Write-Host ""

# Frontend setup
Write-Host "🎨 Setting up Frontend..." -ForegroundColor Yellow

if (Test-Path "package.json") {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend installation failed" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Frontend package.json not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Configure backend/.env with your MongoDB Atlas connection string" -ForegroundColor White
Write-Host "2. Open 2 terminals:" -ForegroundColor White
Write-Host "   Terminal 1: cd backend && npm run dev" -ForegroundColor Yellow
Write-Host "   Terminal 2: npm run dev" -ForegroundColor Yellow
Write-Host "3. Open browser: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "📚 Read QUICK_START.md for more information" -ForegroundColor Cyan
Write-Host ""
