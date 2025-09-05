import { Metadata } from 'next';
import { NewsPageClient } from '@/components/news/NewsPageClient';
import { apiClient } from '@/lib/api';

interface NewsPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  try {
    const news = await apiClient.getNewsBySlug(params.slug);
    
    return {
      title: `${news.title} | Poliq`,
      description: news.summary || news.aiSummary || 'Leia a notícia completa no Poliq',
      keywords: news.tags?.join(', ') || 'notícias, política, economia, tecnologia',
      authors: [{ name: 'Poliq' }],
      openGraph: {
        title: news.title,
        description: news.summary || news.aiSummary || 'Leia a notícia completa no Poliq',
        type: 'article',
        publishedTime: news.createdAt,
        authors: ['Poliq'],
        images: news.imageUrl ? [
          {
            url: news.imageUrl,
            width: 1200,
            height: 630,
            alt: news.title,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: news.title,
        description: news.summary || news.aiSummary || 'Leia a notícia completa no Poliq',
        images: news.imageUrl ? [news.imageUrl] : [],
      },
      alternates: {
        canonical: `/news/${params.slug}`,
      },
    };
  } catch (error) {
    return {
      title: 'Notícia não encontrada | Poliq',
      description: 'A notícia que você está procurando não foi encontrada.',
    };
  }
}

export default function NewsPage({ params }: NewsPageProps) {
  return <NewsPageClient slug={params.slug} />;
}
