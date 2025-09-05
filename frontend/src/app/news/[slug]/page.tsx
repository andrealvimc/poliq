import { NewsPageClient } from '@/components/news/NewsPageClient';

interface NewsPageProps {
  params: {
    slug: string;
  };
}

export default function NewsPage({ params }: NewsPageProps) {
  return <NewsPageClient slug={params.slug} />;
}
