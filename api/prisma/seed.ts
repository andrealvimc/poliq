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
  const gNewsSource = await prisma.externalSource.upsert({
    where: { name: 'GNews' },
    update: {},
    create: {
      name: 'GNews',
      type: SourceType.NEWS_API,
      baseUrl: 'https://gnews.io/api/v4',
      isActive: true,
      config: {
        language: 'pt',
        country: 'br',
        category: 'general',
        max: 10,
      },
    },
  });

  console.log('📡 External source created:', gNewsSource.name);

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
