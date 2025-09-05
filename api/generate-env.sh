#!/bin/bash

echo "🔧 Generating .env file for Poliq development..."

# Create .env file
cat > .env << 'EOF'
# Database (configured for docker-compose.dev.yml)
DATABASE_URL="postgresql://poliq:poliq123@localhost:5432/poliq_dev?schema=public"

# JWT
JWT_SECRET="poliq-super-secret-jwt-key-2024-dev"
JWT_EXPIRES_IN="7d"

# Redis (configured for docker-compose.dev.yml)
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""

# OpenAI API (add your key here)
OPENAI_API_KEY="your-openai-api-key"

# GNews API (add your key here)
GNEWS_API_KEY="your-gnews-api-key"

# Meta Graph API (Instagram/Facebook) - add your tokens here
META_ACCESS_TOKEN="your-meta-access-token"
META_APP_ID="your-meta-app-id"
META_APP_SECRET="your-meta-app-secret"

# Image generation is handled by MediaModule (Node Canvas)
# No external APIs needed for image generation

# App Configuration
NODE_ENV="development"
PORT=3000
API_PREFIX="api/v1"

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100

# Scheduler Configuration
NEWS_FETCH_INTERVAL="0 */30 * * * *" # Every 30 minutes
CONTENT_GENERATION_INTERVAL="0 0 */2 * * * *" # Every 2 hours

# Storage Configuration (for MediaModule)
STORAGE_TYPE="local"
STORAGE_BASE_URL="http://localhost:3000"

# Media Generation
MEDIA_UPLOAD_PATH="uploads/media"
MEDIA_MAX_FILE_SIZE="10485760" # 10MB

# Additional Development Settings
LOG_LEVEL="debug"
ENABLE_SWAGGER="true"
EOF

echo "✅ .env file created successfully!"
echo ""
echo "📝 Important: Update the following API keys in your .env file:"
echo "   - OPENAI_API_KEY (for AI text processing)"
echo "   - GNEWS_API_KEY (for news fetching)"
echo "   - META_ACCESS_TOKEN (for social media publishing)"
echo "   - Image generation uses MediaModule (no API keys needed!)"
echo ""
echo "🔗 The database is configured to work with docker-compose.dev.yml"
echo "   Database: postgresql://poliq:poliq123@localhost:5432/poliq_dev"
echo "   Redis: localhost:6379"
echo ""
echo "🚀 Next steps:"
echo "   1. chmod +x generate-env.sh && ./generate-env.sh"
echo "   2. docker-compose -f docker-compose.dev.yml up -d"
echo "   3. pnpm install"
echo "   4. pnpm run db:generate && pnpm run db:migrate && pnpm run db:seed"
echo "   5. pnpm run start:dev"
