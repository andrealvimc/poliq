'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  Clock,
  Eye,
  MessageCircle,
  Share2,
  Zap,
  Globe,
  Shield
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { News, SearchParams } from '@/types';
import { FeaturedNews } from './FeaturedNews';
import { NewsCard } from './NewsCard';
import { NewsSidebar } from './NewsSidebar';

export const PublicNewsList: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');

  useEffect(() => {
    fetchNews();
  }, [currentPage, tagFilter, sortBy]);

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

  // Simular notícias populares e recentes para sidebar
  const popularNews = news.slice(0, 5);
  const recentNews = news.slice(0, 4);

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Featured News Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
        
        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-4" />
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-32 mb-4" />
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Skeleton key={j} className="h-12 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="max-w-4xl">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="h-6 w-6" />
            <span className="text-lg font-semibold">Notícias Processadas com IA</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Fique por dentro das principais notícias
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Análise inteligente e perspectiva editorial de direita sobre os acontecimentos mais importantes
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar notícias, temas, palavras-chave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-12 h-12 bg-white/90 border-0 text-gray-900 placeholder-gray-500"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="h-12 px-8 bg-white text-blue-600 hover:bg-gray-100"
            >
              <Search className="h-5 w-5 mr-2" />
              Buscar
            </Button>
          </div>
        </div>
      </div>

      {/* Featured News */}
      {news.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">Destaque da Semana</h2>
          </div>
          <FeaturedNews news={news[0]} />
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* News Grid */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters and Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {getAvailableTags().map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="popular">Mais populares</SelectItem>
                  <SelectItem value="trending">Em alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* News Grid/List */}
          {news.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Nenhuma notícia encontrada</h3>
                  <p className="text-gray-500">Tente ajustar os filtros ou buscar por outros termos</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid gap-6 md:grid-cols-2" 
                : "space-y-4"
            }>
              {news.slice(1).map((item) => (
                <NewsCard 
                  key={item.id} 
                  news={item} 
                  variant={viewMode === 'list' ? 'compact' : 'default'} 
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
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
                <span className="text-sm px-3 py-1 bg-white rounded border">
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <NewsSidebar popularNews={popularNews} recentNews={recentNews} />
        </div>
      </div>

      {/* AI Processing Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Conteúdo Processado por Inteligência Artificial
              </h3>
              <p className="text-gray-700 mb-4">
                Nossas notícias são processadas e analisadas por IA com perspectiva editorial de direita, 
                mantendo os fatos principais mas apresentando uma análise crítica e conservadora. 
                Para informações completas e atualizadas, sempre consulte a fonte original de cada artigo.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Processamento em tempo real</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <span>Fontes confiáveis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>Análise inteligente</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
