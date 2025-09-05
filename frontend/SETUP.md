# Setup do Frontend Poliq

## Configuração Inicial

1. **Instalar dependências:**
   ```bash
   pnpm install
   ```

2. **Configurar variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
   ```

3. **Executar em desenvolvimento:**
   ```bash
   pnpm dev
   ```

4. **Build para produção:**
   ```bash
   pnpm build
   pnpm start
   ```

## Estrutura do Projeto

- **Dashboard Admin**: `/dashboard` - Painel administrativo completo
- **Portal Público**: `/` - Lista de notícias públicas
- **Visualização**: `/news/[slug]` - Página individual de notícias

## Funcionalidades Implementadas

### ✅ Dashboard Administrativo
- Gestão completa de notícias (CRUD)
- Ferramentas de IA para processamento de conteúdo
- Geração de imagens com templates
- Gerenciamento de provedores externos
- Sistema de publicações em redes sociais
- Monitoramento de filas em tempo real

### ✅ Portal Público
- Lista de notícias publicadas
- Busca e filtros por tags
- Visualização individual de notícias
- Compartilhamento em redes sociais

### ✅ Autenticação
- Login com JWT
- Controle de acesso por roles (ADMIN, EDITOR, VIEWER)
- Middleware de proteção de rotas

## Tecnologias Utilizadas

- **Next.js 15** com App Router
- **TypeScript** para tipagem
- **Tailwind CSS** para estilização
- **Shadcn/ui** para componentes
- **React Hook Form** para formulários
- **Zod** para validação
- **Axios** para requisições HTTP
- **Date-fns** para manipulação de datas

## Próximos Passos

1. Conectar com o backend NestJS
2. Testar todas as funcionalidades
3. Implementar testes automatizados
4. Configurar CI/CD
5. Deploy em produção
