#!/bin/bash

echo "🧪 Testing Poliq setup..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Run ./generate-env.sh first"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "❌ node_modules not found. Run pnpm install first"
    exit 1
fi

# Test Prisma generate
echo "🔧 Testing Prisma generate..."
pnpm run db:generate

if [ $? -eq 0 ]; then
    echo "✅ Prisma generate successful"
else
    echo "❌ Prisma generate failed"
    exit 1
fi

# Test database connection (only if DB is running)
echo "🗄️ Testing database connection..."
if pnpm prisma db push --force-reset --skip-generate; then
    echo "✅ Database connection successful"
    
    # Test seed
    echo "🌱 Testing database seed..."
    if pnpm run db:seed; then
        echo "✅ Database seed successful"
    else
        echo "❌ Database seed failed"
        exit 1
    fi
else
    echo "⚠️ Database not available. Make sure PostgreSQL is running:"
    echo "   docker-compose -f docker-compose.dev.yml up -d"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Setup is working correctly."
echo ""
echo "🚀 You can now start the server:"
echo "   pnpm run start:dev"
