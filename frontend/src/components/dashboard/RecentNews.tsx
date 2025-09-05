'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ExternalLink, Eye } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { News, NewsStatus } from '@/types';

export const RecentNews: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentNews = async () => {
      try {
        const response = await apiClient.getNews({ limit: 5 });
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching recent news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentNews();
  }, []);

  const getStatusBadgeVariant = (status: NewsStatus) => {
    switch (status) {
      case NewsStatus.PUBLISHED:
        return 'default';
      case NewsStatus.DRAFT:
        return 'secondary';
      case NewsStatus.ARCHIVED:
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: NewsStatus) => {
    switch (status) {
      case NewsStatus.PUBLISHED:
        return 'Publicado';
      case NewsStatus.DRAFT:
        return 'Rascunho';
      case NewsStatus.ARCHIVED:
        return 'Arquivado';
      default:
        return 'Desconhecido';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notícias Recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex space-x-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notícias Recentes</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/news">
            <Eye className="mr-2 h-4 w-4" />
            Ver todas
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma notícia encontrada
          </p>
        ) : (
          news.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-medium line-clamp-2">
                  {item.title}
                </h4>
                {item.originalLink && (
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={item.originalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
              
              {item.summary && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.summary}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusBadgeVariant(item.status)}>
                    {getStatusLabel(item.status)}
                  </Badge>
                  {item.tags.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {item.tags[0]}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
