import { useState, useEffect } from 'react';
import { News } from '@/types';
import { apiClient } from '@/lib/api';

export const usePopularNews = (limit: number = 5) => {
  const [popularNews, setPopularNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const news = await apiClient.getPopularNews(limit);
        setPopularNews(news);
      } catch (err) {
        console.error('Erro ao buscar notícias populares:', err);
        setError('Erro ao carregar notícias populares');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularNews();
  }, [limit]);

  return { popularNews, loading, error };
};
