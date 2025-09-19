#!/bin/bash

# Crypto Classification API Deployment Script

echo "🚀 Crypto Classification API Deployment"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found. Please run this script from the tfjs_model directory."
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo "📋 Files to deploy:"
ls -la

echo ""
echo "🎯 Choose deployment platform:"
echo "1) Vercel (Recommended)"
echo "2) Netlify"
echo "3) Railway"
echo "4) Render"
echo "5) Test locally first"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "📦 Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        echo "🔐 Please login to Vercel:"
        vercel login
        
        echo "🚀 Deploying..."
        vercel --prod
        
        echo "✅ Deployment complete!"
        echo "🌐 Your API is now live on Vercel!"
        ;;
        
    2)
        echo "🚀 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "📦 Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        echo "🔐 Please login to Netlify:"
        netlify login
        
        echo "🚀 Deploying..."
        netlify deploy --prod
        
        echo "✅ Deployment complete!"
        echo "🌐 Your API is now live on Netlify!"
        ;;
        
    3)
        echo "🚀 Deploying to Railway..."
        echo "📋 Instructions:"
        echo "1. Go to https://railway.app"
        echo "2. Connect your GitHub repository"
        echo "3. Select this project"
        echo "4. Railway will auto-deploy"
        echo ""
        echo "📁 Make sure these files are in your repo:"
        echo "   - server.js"
        echo "   - complete_classifier.js"
        echo "   - package.json"
        echo "   - All model files"
        ;;
        
    4)
        echo "🚀 Deploying to Render..."
        echo "📋 Instructions:"
        echo "1. Go to https://render.com"
        echo "2. Create a new Web Service"
        echo "3. Connect your GitHub repository"
        echo "4. Set build command: npm install"
        echo "5. Set start command: node server.js"
        echo "6. Deploy!"
        ;;
        
    5)
        echo "🧪 Testing locally..."
        echo "📦 Installing dependencies..."
        npm install
        
        echo "🚀 Starting local server..."
        echo "📡 API will be available at: http://localhost:3000"
        echo "🔍 Test endpoint: POST http://localhost:3000/classify"
        echo ""
        echo "Press Ctrl+C to stop the server"
        node server.js
        ;;
        
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo "📚 Check DEPLOYMENT_GUIDE.md for detailed instructions"
