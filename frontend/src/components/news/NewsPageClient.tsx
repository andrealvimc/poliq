'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NewsView } from './NewsView';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { apiClient } from '@/lib/api';
import { News } from '@/types';

interface NewsPageClientProps {
  slug: string;
}

export const NewsPageClient: React.FC<NewsPageClientProps> = ({ slug }) => {
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getNewsBySlug(slug);
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Notícia não encontrada
            </h1>
            <p className="text-gray-600 mb-6">
              A notícia que você está procurando não existe ou foi removida.
            </p>
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Voltar ao início
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <NewsView news={news} />;
};
