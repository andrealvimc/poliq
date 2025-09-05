# Poliq Frontend - Dashboard Administrativo

Frontend moderno para o sistema Poliq de gestão de notícias com IA, construído com Next.js 15, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

### 📰 Gestão de Notícias
- **CRUD Completo**: Criar, editar, visualizar e excluir notícias
- **Status Management**: Rascunho, Publicado, Arquivado
- **Busca e Filtros**: Busca por texto, filtros por status e tags
- **Paginação**: Navegação eficiente através de grandes volumes de dados

### 🤖 Inteligência Artificial
- **Processamento de Conteúdo**: Otimização automática de títulos e conteúdo
- **Geração de Resumos**: Resumos automáticos usando IA
- **Sugestão de Tags**: Tags inteligentes baseadas no conteúdo
- **Comentários**: Geração de comentários e análises
- **Extração de Keywords**: Palavras-chave relevantes

### 🎨 Geração de Mídia
- **Templates Personalizáveis**: Múltiplos templates para imagens
- **Formatos Diversos**: PNG, JPEG, WebP
- **Otimização para Redes Sociais**: Imagens específicas para Instagram, Facebook, Twitter
- **Geração Base64**: Para integração direta
- **Galeria de Imagens**: Gerenciamento visual das imagens geradas

### 🔗 Provedores Externos
- **Múltiplas Fontes**: Integração com diversas fontes de notícias
- **Busca Automática**: Coleta automática de notícias
- **Processamento em Lote**: Processamento inteligente de múltiplas notícias
- **Controle de Status**: Ativar/desativar fontes individualmente

### 📱 Publicação em Redes Sociais
- **Múltiplas Plataformas**: Instagram, Facebook, Twitter
- **Status de Publicação**: Acompanhamento em tempo real
- **Retry Automático**: Reprocessamento de publicações falhadas
- **URLs de Acompanhamento**: Links diretos para as publicações

### 📊 Monitoramento de Filas
- **Dashboard em Tempo Real**: Estatísticas ao vivo
- **Controle de Filas**: Pausar/retomar processamento
- **Métricas Detalhadas**: Jobs aguardando, ativos, concluídos, falhados
- **Alertas**: Notificações para jobs com falha

## 🛠️ Tecnologias

- **Next.js 15**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização utilitária
- **Shadcn/ui**: Componentes de interface
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de schemas
- **Axios**: Cliente HTTP
- **Date-fns**: Manipulação de datas
- **Lucide React**: Ícones
- **Sonner**: Notificações toast

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── dashboard/         # Páginas do dashboard
│   │   ├── news/          # Gestão de notícias
│   │   ├── ai/            # Ferramentas de IA
│   │   ├── media/         # Gerenciamento de mídia
│   │   ├── providers/     # Provedores externos
│   │   ├── publications/  # Publicações
│   │   └── queues/        # Monitoramento de filas
│   ├── login/             # Página de login
│   └── layout.tsx         # Layout raiz
├── components/            # Componentes reutilizáveis
│   ├── auth/              # Componentes de autenticação
│   ├── dashboard/         # Componentes do dashboard
│   ├── layout/            # Layout e navegação
│   ├── news/              # Componentes de notícias
│   ├── ai/                # Componentes de IA
│   ├── media/             # Componentes de mídia
│   ├── providers/         # Componentes de provedores
│   ├── publications/      # Componentes de publicações
│   ├── queues/            # Componentes de filas
│   └── ui/                # Componentes base (Shadcn/ui)
├── contexts/              # Contextos React
├── hooks/                 # Hooks customizados
├── lib/                   # Utilitários e configurações
├── types/                 # Definições de tipos TypeScript
└── middleware.ts          # Middleware do Next.js
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- pnpm (gerenciador de pacotes)
- Backend Poliq rodando na porta 3000

### Instalação
```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com as configurações corretas

# Executar em desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Executar em produção
pnpm start
```

### Variáveis de Ambiente
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## 🔐 Autenticação

O sistema utiliza JWT para autenticação com três níveis de acesso:

- **ADMIN**: Acesso total ao sistema
- **EDITOR**: Pode gerenciar notícias, usar IA e mídia
- **VIEWER**: Apenas visualização

## 🎨 Design System

### Cores
- **Primária**: Azul (#3B82F6)
- **Secundária**: Cinza (#6B7280)
- **Sucesso**: Verde (#10B981)
- **Aviso**: Amarelo (#F59E0B)
- **Erro**: Vermelho (#EF4444)

### Componentes
Todos os componentes seguem o design system do Shadcn/ui com customizações específicas para o Poliq.

## 📱 Responsividade

O dashboard é totalmente responsivo e funciona perfeitamente em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔧 Desenvolvimento

### Estrutura de Componentes
Cada componente segue o padrão:
- Props tipadas com TypeScript
- Estados gerenciados com React hooks
- Validação com Zod
- Estilização com Tailwind CSS

### API Integration
- Cliente HTTP centralizado em `lib/api.ts`
- Interceptors para autenticação automática
- Tratamento de erros consistente
- Tipagem completa das respostas

### Estado Global
- Context API para autenticação
- Estados locais para componentes específicos
- Persistência de dados com cookies e localStorage

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Build e deploy automático
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Performance

- **Server Components**: Renderização no servidor quando possível
- **Lazy Loading**: Carregamento sob demanda de componentes
- **Image Optimization**: Otimização automática de imagens
- **Code Splitting**: Divisão automática do código
- **Caching**: Cache inteligente de dados

## 🔒 Segurança

- **JWT Authentication**: Tokens seguros com expiração
- **CSRF Protection**: Proteção contra ataques CSRF
- **XSS Prevention**: Sanitização de dados
- **Role-based Access**: Controle de acesso baseado em roles
- **Secure Cookies**: Cookies HTTP-only quando possível

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte e dúvidas, entre em contato através dos canais oficiais do projeto.