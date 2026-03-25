#!/bin/bash

# Noorvi Shayari - Automated Vercel Deployment Script
# This script automates the deployment process to Vercel

echo "🚀 Starting Vercel Deployment for Noorvi Shayari..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found!"
    echo "📦 Installing Vercel CLI globally..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Vercel CLI"
        exit 1
    fi
    echo "✅ Vercel CLI installed successfully"
fi

# Check if user is logged in to Vercel
echo "🔐 Checking Vercel authentication..."
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "🔑 Please login to Vercel..."
    vercel login
    if [ $? -ne 0 ]; then
        echo "❌ Vercel login failed"
        exit 1
    fi
fi

echo "✅ Authenticated with Vercel"
echo ""

# Check for environment variables
echo "⚙️  Checking environment variables..."
if [ ! -f .env.local ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "📝 You'll need to add these environment variables in Vercel dashboard:"
    echo "   - MONGODB_URI"
    echo "   - MONGODB_DB"
    echo "   - ADMIN_SESSION_SECRET"
    echo ""
fi

# Ask for deployment type
echo "📦 Select deployment type:"
echo "1) Preview deployment (for testing)"
echo "2) Production deployment"
read -p "Enter choice (1 or 2): " deploy_choice

case $deploy_choice in
    1)
        echo ""
        echo "🔨 Deploying to preview environment..."
        vercel
        ;;
    2)
        echo ""
        echo "🚀 Deploying to production..."
        vercel --prod
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Visit your Vercel dashboard to add environment variables if not done"
    echo "2. Create your first admin user:"
    echo "   npm run auth:create-user -- --email admin@example.com --password YourPassword --role admin"
    echo "3. Test your deployment by visiting the URL provided above"
    echo ""
    echo "🎉 Your Noorvi Shayari app is live!"
else
    echo ""
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi
