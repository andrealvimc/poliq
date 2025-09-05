# 🚀 Poliq - Automated News Processing Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0+-2D3748.svg)](https://www.prisma.io/)

**Poliq** é uma plataforma automatizada de processamento de notícias que busca, processa com IA e gera conteúdo visual para redes sociais. Transforme notícias em conteúdo viral com inteligência artificial!

## 🎯 Por que usar o Poliq?

- ⚡ **Automação Completa**: De fetch até publicação, tudo automatizado
- 🧠 **IA Avançada**: Processamento inteligente com Ollama ou OpenAI
- 🎨 **Design Profissional**: Templates prontos no padrão InfoMoney
- 📱 **Multi-plataforma**: Gera conteúdo para Instagram, Twitter, LinkedIn
- 🔧 **Fácil Deploy**: Deploy em minutos com Railway, Docker ou VPS
- 💰 **Custo Zero**: Funciona 100% local com Ollama (opcional OpenAI)

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

## 🚀 Quick Demo

```bash
# 1. Clone e instale
git clone https://github.com/andrealvimc/poliq.git
cd poliq && pnpm install

# 2. Configure (copie o .env.example)
cp env.example .env

# 3. Inicie os serviços
docker-compose up -d  # PostgreSQL + Redis
ollama serve          # IA local (opcional)

# 4. Configure o banco
npx prisma migrate deploy
npx prisma db seed

# 5. Inicie a aplicação
pnpm run start:dev

# 6. Acesse: http://localhost:3000
# Login: admin@poliq.com.br / admin123
```

## 🎨 Screenshots

### Dashboard Administrativo
![Dashboard Admin](media/admin-home.png)
*Interface administrativa para gerenciar notícias, filas e configurações*

### Página Principal
![Home Page](media/home.png)
*Página inicial com notícias processadas e categorizadas*

### Visualização de Notícia
![Notícia](media/noticia.png)
*Página de detalhes da notícia com conteúdo gerado por IA*

## 📦 Deployment

### 🚀 Deploy Rápido (Railway)

1. **Fork do repositório** e conecte ao Railway
2. **Configure as variáveis de ambiente**:
   ```env
   DATABASE_URL=postgresql://...
   GNEWS_API_KEY=your-key
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-...
   REDIS_URL=redis://...
   JWT_SECRET=your-secret
   ```
3. **Deploy automático** - Railway detecta o `package.json` e faz deploy

### 🐳 Deploy com Docker

```bash
# Clone e configure
git clone https://github.com/andrealvimc/poliq.git
cd poliq

# Configure environment
cp env.example .env
# Edite o .env com suas configurações

# Deploy com Docker Compose
docker-compose up -d

# Ou build customizado
docker build -t poliq-api .
docker run -p 3000:3000 --env-file .env poliq-api
```

### ☁️ Deploy Manual (VPS/Cloud)

```bash
# 1. Instalar dependências do sistema
sudo apt update
sudo apt install nodejs npm postgresql redis-server

# 2. Configurar banco de dados
sudo -u postgres createdb poliq
sudo -u postgres createuser poliq_user

# 3. Deploy da aplicação
git clone https://github.com/andrealvimc/poliq.git
cd poliq
npm install
npx prisma migrate deploy
npx prisma db seed

# 4. Iniciar serviços
pm2 start npm --name "poliq-api" -- run start:prod
```

### 🔧 Configuração de Produção

#### Variáveis de Ambiente Obrigatórias
```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/poliq"

# APIs Externas
GNEWS_API_KEY="your-gnews-key"
OPENAI_API_KEY="sk-your-openai-key"  # ou configure Ollama

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# AI Provider
AI_PROVIDER="openai"  # ou "ollama"
```

#### Configuração de Domínio
```bash
# Nginx reverse proxy
server {
    listen 80;
    server_name api.poliq.com.br;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 📊 Monitoramento

```bash
# Health check
curl https://api.poliq.com.br/api/v1/health

# Queue status
curl https://api.poliq.com.br/api/v1/queue/stats

# Logs (com PM2)
pm2 logs poliq-api
pm2 monit
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🗺️ Roadmap

### ✅ Versão Atual (v1.0)
- [x] Fetch automático de notícias
- [x] Processamento com IA (Ollama/OpenAI)
- [x] Geração de imagens para Instagram
- [x] Sistema de filas assíncronas
- [x] Dashboard administrativo
- [x] Autenticação JWT

### 🚧 Próximas Versões
- [ ] **v1.1**: Suporte a Twitter e LinkedIn
- [ ] **v1.2**: Templates customizáveis
- [ ] **v1.3**: API de webhooks
- [ ] **v1.4**: Analytics e métricas
- [ ] **v1.5**: Integração com Meta Business
- [ ] **v2.0**: Multi-tenant e white-label

## 🆘 Support

- 📧 **Email**: support@poliq.com.br
- 💬 **Issues**: [GitHub Issues](https://github.com/andrealvimc/poliq/issues)
- 📖 **Docs**: [Documentation](https://docs.poliq.com.br)
- 🐦 **Twitter**: [@poliq_news](https://twitter.com/poliq_news)
- 💼 **LinkedIn**: [Poliq News](https://linkedin.com/company/poliq-news)

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=andrealvimc/poliq&type=Date)](https://star-history.com/#andrealvimc/poliq&Date)

---

**Made with ❤️ by [André Alvim](https://github.com/andrealvimc)**

*Transformando notícias em conteúdo viral desde 2024* 🚀