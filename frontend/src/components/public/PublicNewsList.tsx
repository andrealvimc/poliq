'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  Shield,
  X,
  LoaderCircle
} from 'lucide-react';
import { useQueryState, parseAsString, parseAsInteger, parseAsStringEnum } from 'nuqs';
import { apiClient } from '@/lib/api';
import { News, SearchParams } from '@/types';
import { FeaturedNews } from './FeaturedNews';
import { NewsCard } from './NewsCard';
import { NewsSidebar } from './NewsSidebar';

export const PublicNewsList: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // URL State
  const [searchQuery, setSearchQuery] = useQueryState('q', parseAsString.withDefault(''));
  const [tagFilter, setTagFilter] = useQueryState('tag', parseAsString.withDefault('all'));
  const [currentPage, setCurrentPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [viewMode, setViewMode] = useQueryState('view', parseAsStringEnum(['grid', 'list']).withDefault('grid'));
  const [sortBy, setSortBy] = useQueryState('sort', parseAsStringEnum(['recent', 'popular', 'trending']).withDefault('recent'));

  const fetchNews = useCallback(async () => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      }
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
      setIsInitialLoad(false);
    }
  }, [currentPage, tagFilter, isInitialLoad]);

  const handleSearch = useCallback(async () => {
    if (searchQuery.trim()) {
      try {
        setSearchLoading(true);
        const response = await apiClient.searchNews(searchQuery, {
          page: 1,
          limit: 12,
        });
        setNews(response.data);
        setTotalPages(response.meta.totalPages);
        setTotal(response.meta.total);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error searching news:', error);
      } finally {
        setSearchLoading(false);
      }
    } else {
      // Se não há query, volta para as notícias publicadas
      fetchNews();
    }
  }, [searchQuery, fetchNews]);

  // Efeito principal para buscar notícias
  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchNews();
    }
  }, [currentPage, tagFilter, sortBy, fetchNews]);

  // Debounce para busca automática
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchLoading(false);
      setIsTyping(false);
      return;
    }
    
    setIsTyping(true);
    setSearchLoading(false);
    
    const timeoutId = setTimeout(() => {
      setIsTyping(false);
      handleSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  const getAvailableTags = useMemo(() => {
    const allTags = news.flatMap(item => item.tags || []);
    return Array.from(new Set(allTags)).slice(0, 10);
  }, [news]);

  // Simular notícias recentes para sidebar
  const recentNews = useMemo(() => news.slice(0, 4), [news]);

  if (loading && isInitialLoad) {
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
    <>
      <div className={`space-y-8 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-lg p-4 md:p-6 text-white relative overflow-hidden">
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
              <Zap className="h-3 w-3" />
            </div>
            <span className="text-sm font-medium text-blue-100">Notícias Processadas com IA</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
            Fique por dentro das principais notícias
          </h1>
          
          <p className="text-sm md:text-base text-blue-100 mb-6 max-w-2xl leading-relaxed">
            Análise inteligente e perspectiva editorial sobre os acontecimentos mais importantes
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-2 max-w-2xl">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10 transition-all duration-200 ${isTyping || searchLoading ? 'animate-pulse' : ''}`} />
              <Input
                placeholder="Buscar notícias, temas, palavras-chave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className={`pl-10 h-10 bg-white/95 border-0 text-gray-900 placeholder-gray-500 rounded focus:ring-0 focus:outline-none relative z-0 transition-all duration-200 ${isTyping || searchLoading ? 'opacity-90' : 'opacity-100'}`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-20 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button 
              onClick={handleSearch}
              disabled={searchLoading || isTyping}
              className={`h-10 px-4 bg-white text-blue-600 hover:bg-gray-50 disabled:opacity-50 rounded font-medium transition-all duration-200 cursor-pointer focus:outline-none ${isTyping ? '' : ''}`}
            >
              <Search className="h-4 w-4 mr-2" />
              {searchLoading ? <LoaderCircle className="h-4 w-4 mr-2 animate-spin" /> : isTyping ?   'Buscar' : 'Buscar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Featured News */}
      {/* {news.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">Destaque da Semana</h2>
          </div>
          <FeaturedNews news={news[0]} />
        </div>
      )} */}

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
                  {getAvailableTags.map((tag) => (
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

          {/* Search Results Info */}
          {searchQuery && news.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    <strong>{total}</strong> resultado{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''} para <strong>"{searchQuery}"</strong>
                  </span>
                </div>
                <Button 
                  onClick={() => setSearchQuery('')}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                >
                  Limpar busca
                </Button>
              </div>
            </div>
          )}

          {/* News Grid/List */}
          {news.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {searchQuery ? 'Nenhuma notícia encontrada' : 'Nenhuma notícia disponível'}
                  </h3>
                  <p className="text-gray-500">
                    {searchQuery 
                      ? `Não encontramos resultados para "${searchQuery}". Tente outros termos ou limpe a busca.`
                      : 'Tente ajustar os filtros ou buscar por outros termos'
                    }
                  </p>
                  {searchQuery && (
                    <Button 
                      onClick={() => setSearchQuery('')}
                      variant="outline"
                      className="mt-4"
                    >
                      Limpar busca
                    </Button>
                  )}
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
          <NewsSidebar recentNews={recentNews} />
        </div>
      </div>
      </div>

      {/* AI Processing Info - Full Width */}
      <div className="w-full -mx-4 mt-8">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 rounded-none">
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
    </>
  );
};
