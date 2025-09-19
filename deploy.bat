@echo off
echo 🚀 Crypto Classification API Deployment
echo ========================================

REM Check if we're in the right directory
if not exist "server.js" (
    echo ❌ Error: server.js not found. Please run this script from the tfjs_model directory.
    pause
    exit /b 1
)

echo 📁 Current directory: %CD%
echo 📋 Files to deploy:
dir /b

echo.
echo 🎯 Choose deployment platform:
echo 1) Vercel (Recommended)
echo 2) Netlify
echo 3) Railway
echo 4) Render
echo 5) Test locally first

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo 🚀 Deploying to Vercel...
    where vercel >nul 2>nul
    if errorlevel 1 (
        echo 📦 Installing Vercel CLI...
        npm install -g vercel
    )
    
    echo 🔐 Please login to Vercel:
    vercel login
    
    echo 🚀 Deploying...
    vercel --prod
    
    echo ✅ Deployment complete!
    echo 🌐 Your API is now live on Vercel!
    
) else if "%choice%"=="2" (
    echo 🚀 Deploying to Netlify...
    where netlify >nul 2>nul
    if errorlevel 1 (
        echo 📦 Installing Netlify CLI...
        npm install -g netlify-cli
    )
    
    echo 🔐 Please login to Netlify:
    netlify login
    
    echo 🚀 Deploying...
    netlify deploy --prod
    
    echo ✅ Deployment complete!
    echo 🌐 Your API is now live on Netlify!
    
) else if "%choice%"=="3" (
    echo 🚀 Deploying to Railway...
    echo 📋 Instructions:
    echo 1. Go to https://railway.app
    echo 2. Connect your GitHub repository
    echo 3. Select this project
    echo 4. Railway will auto-deploy
    echo.
    echo 📁 Make sure these files are in your repo:
    echo    - server.js
    echo    - complete_classifier.js
    echo    - package.json
    echo    - All model files
    
) else if "%choice%"=="4" (
    echo 🚀 Deploying to Render...
    echo 📋 Instructions:
    echo 1. Go to https://render.com
    echo 2. Create a new Web Service
    echo 3. Connect your GitHub repository
    echo 4. Set build command: npm install
    echo 5. Set start command: node server.js
    echo 6. Deploy!
    
) else if "%choice%"=="5" (
    echo 🧪 Testing locally...
    echo 📦 Installing dependencies...
    npm install
    
    echo 🚀 Starting local server...
    echo 📡 API will be available at: http://localhost:3000
    echo 🔍 Test endpoint: POST http://localhost:3000/classify
    echo.
    echo Press Ctrl+C to stop the server
    node server.js
    
) else (
    echo ❌ Invalid choice. Please run the script again.
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment process completed!
echo 📚 Check DEPLOYMENT_GUIDE.md for detailed instructions
pause
