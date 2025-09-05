# 🛠️ Poliq - Complete Setup Guide

Este guia completo irá te ajudar a configurar o ambiente de desenvolvimento do Poliq.

## 📋 Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** ([Install](https://pnpm.io/installation))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Redis** 6+ ([Download](https://redis.io/download))
- **Ollama** (para IA local) ([Install](https://ollama.ai/))
- **Docker** (opcional) ([Download](https://www.docker.com/))

## 🚀 Instalação Rápida

### 1️⃣ Clone e Setup Inicial

```bash
# Clone o repositório
git clone <repository-url>
cd poliq

# Instale dependências
pnpm install

# Configure ambiente
cp env.example .env
```

### 2️⃣ Configure Serviços Externos

#### PostgreSQL + Redis (Docker - Recomendado)
```bash
# Inicie serviços com Docker
docker-compose up -d

# Verifique se estão rodando
docker-compose ps
```

#### Ollama (IA Local Gratuita)
```bash
# macOS
brew install ollama
brew services start ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh
ollama serve &

# Baixe modelo
ollama pull llama3.2:1b
```

### 3️⃣ Configure APIs Externas

#### GNews API (Obrigatória)
1. Acesse [gnews.io](https://gnews.io)
2. Crie conta gratuita
3. Copie sua API key
4. Configure no `.env`:
```env
GNEWS_API_KEY="sua-api-key-aqui"
```

#### OpenAI API (Opcional - se não usar Ollama)
1. Acesse [platform.openai.com](https://platform.openai.com)
2. Crie conta e adicione créditos
3. Configure no `.env`:
```env
AI_PROVIDER="openai"
OPENAI_API_KEY="sk-sua-key-aqui"
```

### 4️⃣ Configure Banco de Dados

```bash
# Execute migrações
npx prisma migrate deploy

# Popule dados iniciais
npx prisma db seed

# (Opcional) Abra interface visual
npx prisma studio
```

### 5️⃣ Inicie Aplicação

```bash
# Modo desenvolvimento
pnpm run start:dev

# Aplicação estará disponível em:
# API: http://localhost:3000
# Docs: http://localhost:3000/api/v1/docs
```

## 🔧 Configuração Detalhada

### Arquivo .env Completo

```env
# ===================
# DATABASE
# ===================
DATABASE_URL="postgresql://poliq:poliq123@localhost:5432/poliq?schema=public"

# ===================
# AUTHENTICATION
# ===================
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# ===================
# REDIS (Queue)
# ===================
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""

# ===================
# AI CONFIGURATION
# ===================
# Escolha: "ollama" (gratuito) ou "openai" (pago)
AI_PROVIDER="ollama"

# Ollama (Local - Gratuito)
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.2:1b"
OLLAMA_MAX_TOKENS="200"

# OpenAI (Cloud - Pago)
OPENAI_API_KEY="sk-proj-sua-key-aqui"
OPENAI_MODEL="gpt-3.5-turbo"
OPENAI_MAX_TOKENS="300"

# ===================
# EXTERNAL APIs
# ===================
# GNews API (Obrigatória)
GNEWS_API_KEY="sua-gnews-api-key"

# Meta Graph API (Instagram/Facebook - Opcional)
META_ACCESS_TOKEN="seu-meta-token"
META_APP_ID="seu-app-id"
META_APP_SECRET="seu-app-secret"

# ===================
# APPLICATION
# ===================
NODE_ENV="development"
PORT=3000
API_PREFIX="api/v1"

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Scheduler (Cron)
NEWS_FETCH_INTERVAL="0 */30 * * * *"  # A cada 30 min
CONTENT_GENERATION_INTERVAL="0 0 */2 * * *"  # A cada 2h

# Media Generation
MEDIA_MAX_FILE_SIZE="10485760"  # 10MB
LOG_LEVEL="debug"
ENABLE_SWAGGER="true"
```

## 📁 Estrutura do Projeto

```
poliq/
├── 📁 src/
│   ├── 🤖 ai/                 # Processamento IA
│   │   ├── services/
│   │   │   ├── openai.service.ts
│   │   │   ├── ollama.service.ts
│   │   │   └── content-processor.service.ts
│   │   └── ai.controller.ts
│   ├── 🔐 auth/               # Autenticação JWT
│   ├── 📰 news/               # Gerenciamento notícias
│   ├── 🎨 media/              # Geração imagens
│   │   ├── templates/         # Templates visuais
│   │   └── services/
│   ├── 📡 providers/          # APIs externas
│   │   └── services/
│   │       └── gnews.service.ts
│   ├── ⚡ queue/              # Processamento assíncrono
│   │   └── processors/
│   ├── 📅 scheduler/          # Cron jobs
│   └── 🔧 config/             # Configurações
├── 📁 prisma/
│   ├── schema.prisma          # Schema banco
│   ├── seed.ts               # Dados iniciais
│   └── migrations/           # Migrações
├── 📁 uploads/               # Arquivos gerados
└── 📄 docker-compose.yml    # Serviços Docker
```

## 🔄 Fluxo de Funcionamento

1. **Fetch**: GNews API busca notícias por categoria
2. **Save**: Salva no PostgreSQL
3. **AI Queue**: Processa com Ollama/OpenAI
4. **Media Queue**: Gera imagens otimizadas
5. **Ready**: Conteúdo pronto para publicação

## 📊 Comandos de Desenvolvimento

```bash
# 🚀 Desenvolvimento
pnpm run start:dev          # Modo desenvolvimento
pnpm run start:debug        # Com debugger
pnpm run start:prod         # Produção

# 🔨 Build
pnpm run build              # Compilar TypeScript
pnpm run prebuild           # Limpar dist/

# 🧪 Testes
pnpm run test               # Unit tests
pnpm run test:e2e           # End-to-end tests
pnpm run test:cov           # Coverage

# 🔍 Code Quality
pnpm run lint               # ESLint
pnpm run format             # Prettier

# 🗄️ Database
npx prisma studio           # Interface visual
npx prisma migrate dev      # Nova migração
npx prisma db push          # Sync schema
npx prisma generate         # Gerar client
npx prisma db seed          # Popular dados
```

## 🔗 APIs e Endpoints

### Autenticação
```http
POST /api/v1/auth/login
{
  "email": "admin@poliq.com",
  "password": "admin123"
}
```

### Operações Principais
```http
# Buscar e salvar notícias
POST /api/v1/providers/fetch-and-save
Authorization: Bearer <token>

# Reprocessar falhas
POST /api/v1/providers/reprocess-failed
Authorization: Bearer <token>

# Listar notícias
GET /api/v1/news?page=1&limit=10
Authorization: Bearer <token>

# Gerar mídia
POST /api/v1/media/generate
Authorization: Bearer <token>

# Estatísticas das filas
GET /api/v1/queue/stats
Authorization: Bearer <token>
```

## 🐛 Troubleshooting

### ❌ Erro: "Cannot connect to database"
```bash
# Verifique se PostgreSQL está rodando
docker-compose ps
pg_isready -h localhost -p 5432
```

### ❌ Erro: "Redis connection failed"
```bash
# Verifique se Redis está rodando
redis-cli ping  # Deve retornar: PONG
```

### ❌ Erro: "GNews API key not configured"
```bash
# Verifique se a key está no .env
grep GNEWS_API_KEY .env
```

### ❌ Erro: "Ollama server not responding"
```bash
# Inicie o serviço
brew services start ollama
curl http://localhost:11434/api/version
```

## 🚀 Deploy em Produção

### Docker Production
```bash
# Build e execute
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deploy
```bash
# Build aplicação
pnpm run build

# Execute migrações
npx prisma migrate deploy

# Inicie aplicação
pnpm run start:prod
```

## 📞 Suporte

- 🐛 **Issues**: [GitHub Issues](https://github.com/your-repo/poliq/issues)
- 📧 **Email**: dev@poliq.com

## 🎯 Próximos Passos

1. ✅ Configure todas as APIs externas
2. ✅ Teste o fluxo completo com `/providers/fetch-and-save`
3. ✅ Monitore filas com `/queue/stats`
4. ✅ Visualize resultados em `/news`
5. 🚀 Deploy em produção!

---

**🎉 Pronto! Sua instância do Poliq está configurada e funcionando!**