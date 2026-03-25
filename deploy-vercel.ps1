# Noorvi Shayari - Automated Vercel Deployment Script (PowerShell)
# This script automates the deployment process to Vercel

Write-Host "🚀 Starting Vercel Deployment for Noorvi Shayari..." -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found!" -ForegroundColor Red
    Write-Host "📦 Installing Vercel CLI globally..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Vercel CLI installed successfully" -ForegroundColor Green
}

# Check if user is logged in to Vercel
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Cyan
vercel whoami 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔑 Please login to Vercel..." -ForegroundColor Yellow
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Vercel login failed" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Authenticated with Vercel" -ForegroundColor Green
Write-Host ""

# Check for environment variables
Write-Host "⚙️  Checking environment variables..." -ForegroundColor Cyan
if (-not (Test-Path .env.local)) {
    Write-Host "⚠️  Warning: .env.local not found" -ForegroundColor Yellow
    Write-Host "📝 You'll need to add these environment variables in Vercel dashboard:" -ForegroundColor Yellow
    Write-Host "   - MONGODB_URI" -ForegroundColor White
    Write-Host "   - MONGODB_DB" -ForegroundColor White
    Write-Host "   - ADMIN_SESSION_SECRET" -ForegroundColor White
    Write-Host ""
}

# Ask for deployment type
Write-Host "📦 Select deployment type:" -ForegroundColor Cyan
Write-Host "1) Preview deployment (for testing)" -ForegroundColor White
Write-Host "2) Production deployment" -ForegroundColor White
$deployChoice = Read-Host "Enter choice (1 or 2)"

switch ($deployChoice) {
    "1" {
        Write-Host ""
        Write-Host "🔨 Deploying to preview environment..." -ForegroundColor Yellow
        vercel
    }
    "2" {
        Write-Host ""
        Write-Host "🚀 Deploying to production..." -ForegroundColor Cyan
        vercel --prod
    }
    default {
        Write-Host "❌ Invalid choice. Exiting." -ForegroundColor Red
        exit 1
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Visit your Vercel dashboard to add environment variables if not done" -ForegroundColor White
    Write-Host "2. Create your first admin user:" -ForegroundColor White
    Write-Host "   npm run auth:create-user -- --email admin@example.com --password YourPassword --role admin" -ForegroundColor Gray
    Write-Host "3. Test your deployment by visiting the URL provided above" -ForegroundColor White
    Write-Host ""
    Write-Host "🎉 Your Noorvi Shayari app is live!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}
