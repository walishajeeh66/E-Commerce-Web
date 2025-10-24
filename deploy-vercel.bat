@echo off
echo 🚀 Starting Vercel deployment for Wali E-commerce...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Login to Vercel (if not already logged in)
echo 🔐 Checking Vercel authentication...
vercel whoami >nul 2>&1
if errorlevel 1 vercel login

REM Deploy to production
echo 📦 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo 🌐 Your app should be live at the provided URL
echo 📊 Check the Vercel dashboard for deployment status
pause
