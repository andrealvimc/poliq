# 🚀 Guia de Deploy - Poliq

Este guia explica como fazer deploy do projeto Poliq na Vercel (Frontend) e Railway (API).

## 📋 Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Conta na [Railway](https://railway.app)
- Git configurado
- Node.js 18+ instalado

## 🎯 Estrutura do Deploy

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API           │
│   (Vercel)      │───▶│   (Railway)     │
│   Next.js 15    │    │   NestJS        │
└─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Database      │
                       │   (Railway)     │
                       │   PostgreSQL    │
                       └─────────────────┘
```

## 🚀 1. Deploy da API (Railway)

### Passo 1: Preparar a API
```bash
cd api
```

### Passo 2: Instalar Railway CLI
```bash
npm install -g @railway/cli
```

### Passo 3: Login na Railway
```bash
railway login
```

### Passo 4: Inicializar Projeto
```bash
railway init
```

### Passo 5: Adicionar Serviços
```bash
# PostgreSQL Database
railway add postgresql

# Redis
railway add redis
```

### Passo 6: Configurar Variáveis de Ambiente
```bash
# Database
railway variables set DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis
railway variables set REDIS_HOST=${{Redis.REDIS_HOST}}
railway variables set REDIS_PORT=${{Redis.REDIS_PORT}}
railway variables set REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}

# JWT
railway variables set JWT_SECRET=your-super-secret-jwt-key-here
railway variables set JWT_EXPIRES_IN=7d

# External APIs
railway variables set GNEWS_API_KEY=your-gnews-api-key
railway variables set GNEWS_BASE_URL=https://gnews.io/api/v4
railway variables set GNEWS_LANGUAGE=pt
railway variables set GNEWS_COUNTRY=br
railway variables set GNEWS_MAX=10

# AI Configuration
railway variables set AI_PROVIDER=ollama
railway variables set OLLAMA_BASE_URL=http://localhost:11434
railway variables set OLLAMA_MODEL=llama3.2:1b

# Server
railway variables set PORT=3001
railway variables set NODE_ENV=production

# CORS (será atualizado após deploy do frontend)
railway variables set CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### Passo 7: Deploy
```bash
railway up
```

### Passo 8: Executar Migrações
```bash
railway run pnpm prisma migrate deploy
```

### Passo 9: Seed Database (Opcional)
```bash
railway run pnpm prisma db seed
```

### Passo 10: Obter URL da API
```bash
railway status
# Anote a URL da API (ex: https://api-poliq-production.up.railway.app)
```

## 🌐 2. Deploy do Frontend (Vercel)

### Passo 1: Preparar o Frontend
```bash
cd frontend
```

### Passo 2: Instalar Vercel CLI
```bash
npm i -g vercel
```

### Passo 3: Login na Vercel
```bash
vercel login
```

### Passo 4: Deploy
```bash
vercel
```

### Passo 5: Configurar Variáveis de Ambiente
No dashboard da Vercel:
- `NEXT_PUBLIC_API_URL` = `https://sua-api-url.railway.app`

### Passo 6: Obter URL do Frontend
- Acesse o dashboard da Vercel
- Anote a URL do frontend (ex: https://poliq.vercel.app)

## 🔄 3. Atualizar CORS

### Atualizar CORS na API
```bash
cd api
railway variables set CORS_ORIGIN=https://sua-frontend-url.vercel.app
```

## ✅ 4. Verificar Deploy

### Testar API
```bash
curl https://sua-api-url.railway.app/api/v1/health
```

### Testar Frontend
- Acesse https://sua-frontend-url.vercel.app
- Verifique se as notícias carregam
- Teste o login

## 🔧 5. Configurações Avançadas

### Domínios Personalizados

#### Vercel (Frontend)
1. Acesse o dashboard da Vercel
2. Vá em Settings > Domains
3. Adicione seu domínio personalizado
4. Configure DNS conforme instruções

#### Railway (API)
1. Acesse o dashboard da Railway
2. Vá em Settings > Domains
3. Adicione seu domínio personalizado
4. Configure DNS conforme instruções

### Monitoramento

#### Railway
- Acesse o dashboard da Railway
- Monitore logs em tempo real
- Configure alertas

#### Vercel
- Acesse o dashboard da Vercel
- Monitore performance
- Configure analytics

## 🚨 6. Troubleshooting

### Problemas Comuns

#### API não conecta com Frontend
- Verifique CORS_ORIGIN na Railway
- Confirme NEXT_PUBLIC_API_URL na Vercel

#### Database não conecta
- Verifique DATABASE_URL na Railway
- Execute migrações: `railway run pnpm prisma migrate deploy`

#### Build falha
- Verifique logs na Railway/Vercel
- Confirme variáveis de ambiente
- Teste build local: `pnpm build`

### Logs
```bash
# Railway
railway logs

# Vercel
vercel logs
```

## 📊 7. Monitoramento Pós-Deploy

### Health Checks
- API: `https://sua-api-url.railway.app/api/v1/health`
- Frontend: Acesse a página inicial

### Métricas
- Railway: CPU, Memory, Network
- Vercel: Build time, Function duration

## 🔄 8. Atualizações

### Deploy de Atualizações
```bash
# API
cd api
git add .
git commit -m "Update API"
git push
railway up

# Frontend
cd frontend
git add .
git commit -m "Update Frontend"
git push
vercel --prod
```

## 📞 9. Suporte

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Projeto**: [GitHub Issues](https://github.com/andrealvimc/poliq/issues)

---

**🎉 Parabéns! Seu projeto Poliq está no ar!**
