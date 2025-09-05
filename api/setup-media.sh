#!/bin/bash

echo "🎨 Setting up Media Module for Poliq..."

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads/media

# Set permissions
chmod 755 uploads
chmod 755 uploads/media

echo "✅ Media Module setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Install dependencies: pnpm install"
echo "2. Make sure Canvas native dependencies are installed:"
echo "   - macOS: brew install pkg-config cairo pango libpng jpeg giflib librsvg"
echo "   - Ubuntu: sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev"
echo "3. Start the server: npm run start:dev"
echo "4. Test image generation: POST /api/v1/media/generate"
echo ""
echo "🔗 API Documentation: http://localhost:3000/api/v1/docs#/media"
