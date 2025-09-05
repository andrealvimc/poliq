# 🚀 Deploy Frontend na Vercel

## 1. Preparação
```bash
cd frontend
```

## 2. Instalar Vercel CLI
```bash
npm i -g vercel
```

## 3. Login na Vercel
```bash
vercel login
```

## 4. Deploy
```bash
vercel
```

## 5. Configurar Variáveis de Ambiente
No dashboard da Vercel:
- `NEXT_PUBLIC_API_URL` = `https://your-api-url.railway.app`

## 6. Domínio Personalizado (Opcional)
- Acesse o dashboard da Vercel
- Vá em Settings > Domains
- Adicione seu domínio personalizado

## 7. Configurações Avançadas
- **Framework Preset**: Next.js
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`
