'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Search,
  Calendar,
  Tag,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { News, SearchParams } from '@/types';

export const PublicNewsList: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchNews();
  }, [currentPage, tagFilter]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params: SearchParams = {
        page: currentPage,
        limit: 12,
      };
      
      if (tagFilter && tagFilter !== 'all') {
        const response = await apiClient.getNewsByTag(tagFilter, params);
        setNews(response.data);
        setTotalPages(response.meta.totalPages);
        setTotal(response.meta.total);
      } else {
        const response = await apiClient.getPublishedNews(params);
        setNews(response.data);
        setTotalPages(response.meta.totalPages);
        setTotal(response.meta.total);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Implementar busca
      console.log('Searching for:', searchQuery);
    }
  };

  const getAvailableTags = () => {
    const allTags = news.flatMap(item => item.tags || []);
    return Array.from(new Set(allTags)).slice(0, 10);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
                <div className="flex space-x-2 mt-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar notícias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filtrar por tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as tags</SelectItem>
            {getAvailableTags().map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button onClick={handleSearch}>
          Buscar
        </Button>
      </div>

      {/* News Grid */}
      {news.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground">Nenhuma notícia encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <Card key={item.id} className="hover:shadow-lg p-0 transition-shadow">
              <CardHeader className="py-4 px-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold line-clamp-2">
                    <Link 
                      href={`/news/${item.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(item.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    
                    {item.originalSource && (
                      <span>{item.originalSource}</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 ">
                {item.imageUrl && (
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {item.summary && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {item.summary}
                  </p>
                )}
                
                <div className="space-y-3">
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/news/${item.slug}`}>
                        Ler mais
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                    
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {news.length} de {total} notícias
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {/* AI Disclaimer */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">AI</span>
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-800">
              Conteúdo Processado por IA
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              As notícias são processadas e otimizadas por inteligência artificial. 
              Para informações completas e atualizadas, sempre consulte a fonte original de cada artigo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
