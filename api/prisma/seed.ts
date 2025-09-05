import { PrismaClient, UserRole, SourceType } from '@prisma/client';
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
      type: SourceType.GNEWS_API,
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
      type: SourceType.NEWSAPI_ORG,
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
      type: SourceType.REDDIT_API,
      baseUrl: 'https://www.reddit.com',
      isActive: false, // Opcional
      config: {
        subreddits: ['brasil', 'investimentos', 'tecnologia'],
        userAgent: 'PoliqNewsBot/1.0'
      },
    },
    {
      name: 'Twitter API',
      type: SourceType.TWITTER_API,
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

  // Create sample news (optional)
  const sampleNews = await prisma.news.create({
    data: {
      title: 'Notícia de Exemplo - Tecnologia em Alta',
      slug: 'noticia-exemplo-tecnologia',
      summary: 'Esta é uma notícia de exemplo para demonstrar o funcionamento do sistema.',
      content: 'Conteúdo completo da notícia de exemplo. Aqui você pode colocar todo o texto da notícia com detalhes e informações relevantes.',
      originalLink: 'https://exemplo.com/noticia',
      originalSource: 'Portal Exemplo',
      tags: ['tecnologia', 'exemplo', 'demo'],
      publishedAt: new Date(),
      status: 'READY',
    },
  });

  console.log('📰 Sample news created:', sampleNews.title);

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
