#!/bin/bash

# ntwanaAfrika Team Setup Script
# This script helps new team members set up their development environment

echo "🌍 Welcome to ntwanaAfrika - Learning Feeds the Future!"
echo "================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install it along with Node.js"
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing project dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  Environment file not found. Creating .env.local from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local from template"
        echo "🔧 Please update .env.local with your actual API keys:"
        echo "   - Google Gemini AI API key"
        echo "   - Google Maps API key"
    else
        echo "❌ .env.example not found. Please create .env.local manually"
    fi
else
    echo "✅ Environment file exists"
fi

# Check environment variables
echo ""
echo "🔧 Checking environment configuration..."
source .env.local 2>/dev/null || true

if [ -z "$GOOGLE_API_KEY" ] || [ "$GOOGLE_API_KEY" = "your_gemini_api_key_here" ]; then
    echo "⚠️  GOOGLE_API_KEY not configured in .env.local"
fi

if [ -z "$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" ] || [ "$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" = "your_google_maps_api_key_here" ]; then
    echo "⚠️  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not configured in .env.local"
fi

echo ""
echo "🚀 Setup complete! You can now run:"
echo "   npm run dev    - Start development server"
echo "   npm run build  - Build for production"
echo "   npm run lint   - Run code linting"
echo ""
echo "📚 For more information, check the README.md file"
echo "🤝 Happy coding with the ntwanaAfrika team!"
