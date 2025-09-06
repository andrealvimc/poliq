'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ArrowLeft, Calendar, Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '@/lib/api';
import { News, PaginatedResponse } from '@/types';

const categoryIcons: Record<string, string> = {
  politica: '🏛️',
  economia: '📈',
  tecnologia: '💻',
  saude: '🏥',
  negocios: '💼',
  educacao: '🎓',
  automotivo: '🚗',
  imoveis: '🏠',
  gastronomia: '🍽️',
  entretenimento: '🎮',
  esportes: '⚽',
  cultura: '🎭',
  meioambiente: '🌱',
  seguranca: '🛡️',
  internacional: '🌍',
};

const categoryNames: Record<string, string> = {
  politica: 'Política',
  economia: 'Economia',
  tecnologia: 'Tecnologia',
  saude: 'Saúde',
  negocios: 'Negócios',
  educacao: 'Educação',
  automotivo: 'Automotivo',
  imoveis: 'Imóveis',
  gastronomia: 'Gastronomia',
  entretenimento: 'Entretenimento',
  esportes: 'Esportes',
  cultura: 'Cultura',
  meioambiente: 'Meio Ambiente',
  seguranca: 'Segurança',
  internacional: 'Internacional',
};

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const [news, setNews] = useState<PaginatedResponse<News> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 12;

  const categoryName = categoryNames[categorySlug] || categorySlug;
  const categoryIcon = categoryIcons[categorySlug] || '📰';

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getNewsByCategory(categorySlug, {
          page,
          limit,
        });
        setNews(response);
      } catch (err) {
        setError('Erro ao carregar notícias da categoria');
        console.error('Error fetching category news:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchNews();
    }
  }, [categorySlug, page]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && !news) {
    return (
      <PublicLayout>
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-96">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Erro</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button asChild>
                <Link href="/categorias">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar às Categorias
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="px-4 py-8">
        {/* Header */}
        <div className="bg-white border-b rounded-lg mb-8">
          <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{categoryIcon}</span>
                <h1 className="text-4xl font-bold text-gray-900">
                  {categoryName}
                </h1>
              </div>
              <p className="text-xl text-gray-600">
                {news?.meta?.total || 0} notícias encontradas
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/categorias">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar às Categorias
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {news?.data && news.data.length > 0 ? (
          <>
            {/* News Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.data.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  {article.imageUrl && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {article.summary && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        {article.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(article.publishedAt)}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {article.views}
                        </div>
                      </div>
                      {article.originalLink && (
                        <Button size="sm" variant="ghost" asChild>
                          <a
                            href={article.originalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    <div className="mt-4">
                      <Button className="w-full" asChild>
                        <Link href={`/news/${article.slug}`}>
                          Ler Notícia
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {news.meta && news.meta.total > news.data.length && (
              <div className="mt-12 text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  size="lg"
                >
                  {loading ? 'Carregando...' : 'Carregar Mais'}
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Nenhuma notícia encontrada
              </h2>
              <p className="text-gray-600 mb-6">
                Não há notícias disponíveis para a categoria "{categoryName}" no momento.
              </p>
              <Button asChild>
                <Link href="/categorias">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Ver Outras Categorias
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </PublicLayout>
  );
}
