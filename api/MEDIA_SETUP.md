# 🎨 MediaModule - Image Generation Setup

## ✅ **Sistema Simplificado**

Removemos todas as dependências de **APIs externas de imagem** e usamos apenas o **MediaModule** com Node Canvas.

### **❌ Removido:**
- DALL-E API integration
- Stability AI / Stable Diffusion API
- Configurações de APIs externas de imagem
- Custos de API para geração de imagem

### **✅ Usando apenas:**
- **MediaModule** com Node Canvas
- **Templates JSON** configuráveis
- **Geração local** de imagens
- **Zero custos** de API para imagens

## 🚀 **Como Funciona Agora**

### **1. Templates Pré-definidos**
```json
// src/media/templates/infomoney.json
{
  "name": "InfoMoney Style",
  "dimensions": { "width": 1200, "height": 630 },
  "background": { "type": "color", "value": "#1e3a8a" },
  "elements": {
    "title": { "fontSize": 48, "color": "#ffffff" },
    "category": { "backgroundColor": "#ef4444" }
  }
}
```

### **2. Geração via API**
```bash
POST /api/v1/media/generate
{
  "title": "Breaking News",
  "subtitle": "Important update", 
  "category": "TECNOLOGIA",
  "template": "infomoney"
}
```

### **3. Resultado**
- ✅ Imagem PNG/JPEG/WebP gerada
- ✅ Salva em `/uploads/media/`
- ✅ URL retornada para uso
- ✅ Templates consistentes

## 🔧 **APIs Necessárias (atualizadas)**

```env
# ✅ Para processamento de texto
OPENAI_API_KEY="your-key"        # Resumos, headlines, comentários

# ✅ Para buscar notícias  
GNEWS_API_KEY="your-key"         # Fonte de notícias

# ✅ Para redes sociais
META_ACCESS_TOKEN="your-token"   # Instagram/Facebook

# ❌ NÃO PRECISA MAIS:
# DALLE_API_KEY - removido
# STABILITY_API_KEY - removido
```

## 💰 **Vantagens da Mudança**

### **Custo**
- ❌ DALL-E: ~$0.04 por imagem
- ❌ Stability: ~$0.02 por imagem  
- ✅ MediaModule: **$0.00** (local)

### **Performance**
- ❌ APIs: 3-10 segundos por imagem
- ✅ Canvas: **<1 segundo** por imagem

### **Controle**
- ❌ APIs: Resultado imprevisível
- ✅ Templates: **100% consistente**

### **Customização**
- ❌ APIs: Limitado a prompts
- ✅ Templates: **Total controle** do design

## 🎯 **Templates Disponíveis**

### **1. InfoMoney Style**
```bash
{
  "template": "infomoney",
  "title": "Sua notícia aqui",
  "category": "ECONOMIA"
}
```
- Background azul gradiente
- Logo Poliq
- Tag colorida para categoria
- Fonte profissional

### **2. Default/Clean**
```bash
{
  "template": "default", 
  "title": "Título simples",
  "subtitle": "Subtítulo opcional"
}
```
- Background branco
- Design minimalista
- Boa para qualquer conteúdo

## 🔄 **Integração com News**

```typescript
// Ao criar notícia, gerar imagem automaticamente
const news = await this.newsService.create(newsData);

const imageResult = await this.mediaService.generateImage({
  title: news.title,
  subtitle: news.summary,
  category: news.tags[0]?.toUpperCase(),
  template: 'infomoney'
});

// Salvar URL da imagem na notícia
await this.newsService.update(news.id, {
  imageUrl: imageResult.url,
  imageGenerated: true
});
```

## 🚀 **Próximos Passos**

1. **Rodar setup:**
   ```bash
   ./setup-dev.sh
   ```

2. **Testar geração:**
   ```bash
   # Login
   curl -X POST http://localhost:3000/api/v1/auth/login \
     -d '{"email":"admin@poliq.com","password":"admin123"}'
   
   # Gerar imagem
   curl -X POST http://localhost:3000/api/v1/media/generate \
     -H "Authorization: Bearer TOKEN" \
     -d '{"title":"Teste","template":"infomoney"}'
   ```

3. **Ver resultado:**
   - Imagem salva em: `/uploads/media/`
   - URL retornada: `http://localhost:3000/uploads/media/filename.png`

## 🎨 **Criando Novos Templates**

1. Criar arquivo: `src/media/templates/meu-template.json`
2. Seguir estrutura dos templates existentes
3. Adicionar ao enum: `generate-image.dto.ts`
4. Testar via API

**Sistema limpo, rápido e sem custos de API! 🔥**
