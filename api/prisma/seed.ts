import { PrismaClient, UserRole, SourceType, NewsStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@poliq.com' },
    update: {},
    create: {
      email: 'admin@poliq.com',
      password: hashedPassword,
      name: 'Administrator',
      role: UserRole.ADMIN,
    },
  });

  console.log('👤 Admin user created:', adminUser.email);

  // Create external sources
  const sources = [
    {
      name: 'GNews',
      type: SourceType.NEWS_API,
      baseUrl: 'https://gnews.io/api/v4',
      isActive: false, // Desativado como backup
      config: {
        language: 'pt',
        country: 'br',
        category: 'general',
        max: 10,
      },
    },
    {
      name: 'NewsAPI.org',
      type: SourceType.NEWS_API,
      baseUrl: 'https://newsapi.org/v2',
      isActive: true,
      config: {
        language: 'pt',
        country: 'br',
        max: 20,
      },
    },
    {
      name: 'RSS Feeds - Política',
      type: SourceType.RSS_FEED,
      baseUrl: 'https://g1.globo.com/rss/g1/politica/',
      isActive: true,
      config: {
        category: 'politica',
        sources: [
          'https://g1.globo.com/rss/g1/politica/',
          'https://noticias.uol.com.br/politica/feed.xml',
          'https://www.estadao.com.br/rss/politica.xml',
          'https://www1.folha.uol.com.br/poder/rss091.xml'
        ]
      },
    },
    {
      name: 'RSS Feeds - Economia',
      type: SourceType.RSS_FEED,
      baseUrl: 'https://g1.globo.com/rss/g1/economia/',
      isActive: true,
      config: {
        category: 'economia',
        sources: [
          'https://g1.globo.com/rss/g1/economia/',
          'https://economia.uol.com.br/feed.xml',
          'https://www.estadao.com.br/rss/economia.xml',
          'https://www1.folha.uol.com.br/mercado/rss091.xml',
          'https://www.infomoney.com.br/feed/'
        ]
      },
    },
    {
      name: 'RSS Feeds - Tecnologia',
      type: SourceType.RSS_FEED,
      baseUrl: 'https://g1.globo.com/rss/g1/tecnologia/',
      isActive: true,
      config: {
        category: 'tecnologia',
        sources: [
          'https://g1.globo.com/rss/g1/tecnologia/',
          'https://tecnologia.uol.com.br/feed.xml',
          'https://www.estadao.com.br/rss/tecnologia.xml',
          'https://www1.folha.uol.com.br/tec/rss091.xml',
          'https://www.tecmundo.com.br/feed'
        ]
      },
    },
    {
      name: 'Reddit API',
      type: SourceType.SOCIAL_MEDIA,
      baseUrl: 'https://www.reddit.com',
      isActive: false, // Opcional
      config: {
        subreddits: ['brasil', 'investimentos', 'tecnologia'],
        userAgent: 'PoliqNewsBot/1.0'
      },
    },
    {
      name: 'Twitter API',
      type: SourceType.SOCIAL_MEDIA,
      baseUrl: 'https://api.twitter.com/2',
      isActive: false, // Opcional
      config: {
        version: 'v2',
        endpoints: ['tweets/search/recent']
      },
    }
  ];

  for (const sourceData of sources) {
    const source = await prisma.externalSource.upsert({
      where: { name: sourceData.name },
      update: {
        type: sourceData.type,
        baseUrl: sourceData.baseUrl,
        isActive: sourceData.isActive,
        config: sourceData.config,
      },
      create: sourceData,
    });

    console.log(`📡 External source ${source.isActive ? '✅' : '⏸️'}:`, source.name);
  }

  // Create sample news with different categories
  const sampleNews = [
    {
      title: 'Tecnologia: Inteligência Artificial Revoluciona Mercado',
      slug: 'tecnologia-ia-revoluciona-mercado',
      summary: 'Novas tecnologias de IA estão transformando diversos setores da economia brasileira.',
      content: 'A inteligência artificial está se tornando cada vez mais presente no dia a dia das empresas brasileiras. Desde chatbots até sistemas de análise de dados, a tecnologia está revolucionando a forma como trabalhamos.',
      originalLink: 'https://exemplo.com/ia-mercado',
      originalSource: 'TechNews Brasil',
      tags: ['tecnologia', 'inteligencia-artificial', 'inovacao'],
      publishedAt: new Date(),
      status: NewsStatus.PUBLISHED,
    },
    {
      title: 'Política: Nova Lei de Proteção de Dados Aprovada',
      slug: 'politica-lei-protecao-dados-aprovada',
      summary: 'Senado aprova nova legislação que fortalece a proteção de dados pessoais no Brasil.',
      content: 'O Senado Federal aprovou por unanimidade a nova lei de proteção de dados pessoais, que estabelece regras mais rígidas para o tratamento de informações sensíveis dos cidadãos brasileiros.',
      originalLink: 'https://exemplo.com/lei-dados',
      originalSource: 'Política Hoje',
      tags: ['politica', 'lei', 'protecao-dados'],
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
      status: NewsStatus.PUBLISHED,
    },
    {
      title: 'Economia: Dólar Cai e Bolsa Sobe em Dia Positivo',
      slug: 'economia-dolar-cai-bolsa-sobe',
      summary: 'Mercado financeiro brasileiro registra alta generalizada com queda do dólar.',
      content: 'O dólar comercial fechou o dia em queda de 2,3%, enquanto a Bovespa subiu 1,8%. Analistas atribuem o movimento positivo aos indicadores econômicos favoráveis divulgados hoje.',
      originalLink: 'https://exemplo.com/economia-dolar',
      originalSource: 'Economia & Mercado',
      tags: ['economia', 'dolar', 'bolsa', 'mercado'],
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
      status: NewsStatus.PUBLISHED,
    },
    {
      title: 'Saúde: Vacinação Contra Covid-19 Atinge 80% da População',
      slug: 'saude-vacinacao-covid-80-populacao',
      summary: 'Brasil atinge marca histórica de 80% da população vacinada contra Covid-19.',
      content: 'O Ministério da Saúde anunciou hoje que o Brasil atingiu 80% da população vacinada com pelo menos duas doses contra a Covid-19. A marca representa um marco importante na luta contra a pandemia.',
      originalLink: 'https://exemplo.com/vacinacao-covid',
      originalSource: 'Saúde Pública',
      tags: ['saude', 'covid-19', 'vacinacao', 'pandemia'],
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
      status: NewsStatus.PUBLISHED,
    },
    {
      title: 'Esportes: Brasil Vence Argentina na Copa América',
      slug: 'esportes-brasil-vence-argentina-copa-america',
      summary: 'Seleção brasileira vence Argentina por 2x1 em jogo emocionante da Copa América.',
      content: 'Em um jogo emocionante disputado no Maracanã, a Seleção Brasileira venceu a Argentina por 2x1, com gols de Neymar e Gabriel Jesus. A vitória coloca o Brasil na liderança do grupo.',
      originalLink: 'https://exemplo.com/brasil-argentina',
      originalSource: 'Esporte Total',
      tags: ['esportes', 'futebol', 'copa-america', 'brasil'],
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 dias atrás
      status: NewsStatus.PUBLISHED,
    }
  ];

  for (const newsData of sampleNews) {
    const news = await prisma.news.upsert({
      where: { slug: newsData.slug },
      update: {},
      create: newsData,
    });
    console.log('📰 Sample news created:', news.title);
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
