#!/bin/bash

# Vercel Deployment Script for Wali E-commerce
echo "🚀 Starting Vercel deployment for Wali E-commerce..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami &> /dev/null || vercel login

# Deploy to production
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app should be live at the provided URL"
echo "📊 Check the Vercel dashboard for deployment status"
