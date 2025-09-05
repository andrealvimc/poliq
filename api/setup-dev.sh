#!/bin/bash

echo "🚀 Setting up Poliq development environment..."

# Generate .env file
echo "🔧 Generating .env file..."
chmod +x generate-env.sh
./generate-env.sh

# Start development services
echo "📦 Starting PostgreSQL and Redis..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 5

# Create uploads directory for MediaModule
echo "📁 Creating uploads directory for MediaModule..."
mkdir -p uploads/media
chmod 755 uploads uploads/media

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Setup database
echo "🗄️ Setting up database..."
echo "📝 Generating Prisma client..."
pnpm run db:generate

echo "🔄 Running database migrations..."
pnpm run db:migrate

echo "🌱 Seeding database with initial data..."
pnpm run db:seed

echo "✅ Development environment setup completed!"
echo ""
echo "🎉 Services running:"
echo "- PostgreSQL: localhost:5432 (poliq_dev database)"
echo "- Redis: localhost:6379" 
echo "- Prisma Studio: http://localhost:5555"
echo ""
echo "📝 Remember to update API keys in .env file:"
echo "   - OPENAI_API_KEY (for AI text processing)"
echo "   - GNEWS_API_KEY (for news fetching)"
echo "   - META_ACCESS_TOKEN (for social media publishing)"
echo "   - Image generation uses MediaModule (no API keys needed!)"
echo ""
echo "🚀 Start the API server:"
echo "   pnpm run start:dev"
echo ""
echo "🔗 Access points:"
echo "   - API: http://localhost:3000/api/v1"
echo "   - Docs: http://localhost:3000/api/v1/docs"
echo "   - Health: http://localhost:3000/api/v1/health"
echo ""
echo "🎨 Test MediaModule:"
echo "   - Login: POST /api/v1/auth/login"
echo "   - Generate Image: POST /api/v1/media/generate"
echo "   - Templates: GET /api/v1/media/templates"  