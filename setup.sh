#!/bin/bash

# Forge.AI Setup Script
# This script sets up the development environment

set -e

echo "🔥 Forge.AI Setup Script"
echo "========================"
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  Please add your Gemini API key to .env file:"
    echo "   VITE_GEMINI_API_KEY=your_api_key_here"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Check if API key is set
if grep -q "your_api_key_here" .env 2>/dev/null; then
    echo "⚠️  Warning: Default API key detected in .env"
    echo "   Please update with your actual Gemini API key"
    echo ""
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Add your Gemini API key to .env file"
echo "  2. Run 'npm run dev' to start development server"
echo "  3. Open http://localhost:3003 in your browser"
echo ""
echo "For deployment:"
echo "  - Run 'npm run build' to create production build"
echo "  - See DEPLOYMENT.md for deployment instructions"
echo ""
echo "Happy coding! 🚀"
