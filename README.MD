# 🚀 Poliq - Automated News Processing Platform

**Poliq** é uma plataforma automatizada de processamento de notícias que busca, processa com IA e gera conteúdo visual para redes sociais.

## ✨ Features

- 🔄 **Fetch Automático**: Busca notícias de fontes externas (GNews API)
- 🤖 **Processamento IA**: Gera títulos, resumos e comentários otimizados
- 🎨 **Geração de Mídia**: Cria imagens para Instagram no padrão InfoMoney
- ⚡ **Processamento Assíncrono**: Sistema de filas com Bull Queue
- 📅 **Agendamento**: Cron jobs para automação completa
- 🔐 **Autenticação**: JWT com roles (Admin/Editor)
- 📊 **Categorização**: Foco em Política, Tecnologia e Economia

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GNews API     │───▶│  News Fetcher   │───▶│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
┌─────────────────┐    ┌─────────────────┐            │
│ Social Media    │◀───│ Media Generator │◀───────────┘
└─────────────────┘    └─────────────────┘            │
                                ▲                     │
                                │                     ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Instagram     │    │   AI Processor  │◀───│  Bull Queues    │
└─────────────────┘    │  (Ollama/GPT)   │    └─────────────────┘
                       └─────────────────┘
```

## 🛠️ Tech Stack

- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Queue**: Bull Queue + Redis
- **AI**: Ollama (Local) / OpenAI (Cloud)
- **Image**: Node Canvas + Sharp
- **Auth**: JWT + Passport
- **API**: GNews, Meta Graph API

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis
- Ollama (para IA local)

### Installation

```bash
# Clone repository
git clone https://github.com/andrealvimc/poliq.git
cd poliq

# Install dependencies
pnpm install

# Setup environment
cp env.example .env
# Edit .env with your configurations

# Setup database
npx prisma migrate deploy
npx prisma db seed

# Start services
docker-compose up -d  # Redis + PostgreSQL
ollama serve          # AI Service
pnpm run start:dev    # Application
```

### Configuration

```env
# Database
DATABASE_URL="postgresql://poliq:poliq123@localhost:5432/poliq"

# APIs
GNEWS_API_KEY="your-gnews-api-key"
OPENAI_API_KEY="your-openai-api-key"  # Optional

# AI Provider (ollama or openai)
AI_PROVIDER="ollama"
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.2:1b"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379
```

## 📖 API Documentation

### Authentication
```http
POST /api/v1/auth/login
{
  "email": "admin@poliq.com.br",
  "password": "admin123"
}
```

### News Operations
```http
# Fetch and process news
POST /api/v1/providers/fetch-and-save
Authorization: Bearer <token>

# Get processed news
GET /api/v1/news?page=1&limit=10
Authorization: Bearer <token>

# Generate media
POST /api/v1/media/generate
Authorization: Bearer <token>
```

## 🔄 Workflow

1. **News Fetching**: Sistema busca notícias da GNews API por categoria
2. **AI Processing**: Ollama processa e otimiza títulos/resumos
3. **Media Generation**: Gera imagens no padrão InfoMoney (1080x1080)
4. **Queue Management**: Processa tudo de forma assíncrona
5. **Publication Ready**: Conteúdo pronto para redes sociais

## 📁 Project Structure

```
src/
├── ai/                 # AI processing services
├── auth/               # Authentication & authorization
├── common/             # Shared utilities
├── config/             # Configuration files
├── database/           # Database service
├── media/              # Image generation
├── news/               # News management
├── providers/          # External API integrations
├── publication/        # Social media publishing
├── queue/              # Background job processing
└── scheduler/          # Cron jobs
```

## 🤖 AI Configuration

### Ollama (Local - Free)
```bash
# Install Ollama
brew install ollama

# Start service
brew services start ollama

# Pull model
ollama pull llama3.2:1b

# Configure in .env
AI_PROVIDER="ollama"
```

### OpenAI (Cloud - Paid)
```bash
# Configure in .env
AI_PROVIDER="openai"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-3.5-turbo"
```

## 🎨 Media Templates

O sistema usa templates configuráveis para geração de imagens:

- **InfoMoney Style**: 1080x1080px, banner branco, texto otimizado
- **Customizable**: Colors, fonts, layouts via JSON templates

## 📊 Monitoring

```http
# Queue statistics
GET /api/v1/queue/stats

# System health
GET /api/v1/health
```

## 🔧 Development

```bash
# Development mode
pnpm run start:dev

# Build
pnpm run build

# Tests
pnpm run test

# Database operations
npx prisma studio
npx prisma migrate dev
```

## 📦 Deployment

```bash
# Production build
pnpm run build

# Start production
pnpm run start:prod

# Docker deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@poliq.com.br
- 💬 Issues: [GitHub Issues](https://github.com/andrealvimc/poliq/issues)
- 📖 Docs: [Documentation](https://docs.poliq.com.br)

---

**Made with ❤️ by Poliq Team**