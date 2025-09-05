# 🚂 Deploy API na Railway

## 1. Preparação
```bash
cd api
```

## 2. Instalar Railway CLI
```bash
npm install -g @railway/cli
```

## 3. Login na Railway
```bash
railway login
```

## 4. Inicializar Projeto
```bash
railway init
```

## 5. Adicionar Serviços
```bash
# PostgreSQL Database
railway add postgresql

# Redis
railway add redis
```

## 6. Configurar Variáveis de Ambiente
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

# CORS
railway variables set CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## 7. Deploy
```bash
railway up
```

## 8. Executar Migrações
```bash
railway run pnpm prisma migrate deploy
```

## 9. Seed Database (Opcional)
```bash
railway run pnpm prisma db seed
```

## 10. Verificar Deploy
```bash
railway status
railway logs
```

## 11. Domínio Personalizado (Opcional)
- Acesse o dashboard da Railway
- Vá em Settings > Domains
- Adicione seu domínio personalizado
