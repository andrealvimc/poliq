'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Calendar,
  Tag,
  Check,
  CheckSquare,
  Square,
  Send,
  Archive,
  Loader2,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { News, NewsStatus, SearchParams } from '@/types';
import { toast } from 'sonner';

export const NewsList: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<NewsStatus | 'ALL'>('ALL');
  const [aiStatusFilter, setAiStatusFilter] = useState<'ALL' | 'completed' | 'processing' | 'pending'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeFilters, setActiveFilters] = useState<SearchParams>({});
  
  // Seleção múltipla
  const [selectedNews, setSelectedNews] = useState<Set<string>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const fetchNews = useCallback(async (params?: SearchParams) => {
    try {
      setLoading(true);
      const requestParams = {
        page: currentPage,
        limit: itemsPerPage,
        ...activeFilters,
        ...params,
      };
      console.log('Fetching news with params:', requestParams);
      const response = await apiClient.getNews(requestParams);
      console.log('News response:', response);
      
      // Aplicar filtro de IA no frontend se necessário
      let filteredNews = response.data;
      if (aiStatusFilter !== 'ALL') {
        filteredNews = response.data.filter(item => {
          const aiStatus = getAIProcessingStatus(item);
          return aiStatus.status === aiStatusFilter;
        });
      }
      
      setNews(filteredNews);
      setTotalPages(response.meta.totalPages);
      setTotal(response.meta.total);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, activeFilters, aiStatusFilter]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        setActiveFilters(prev => ({ ...prev, q: searchQuery.trim() }));
        setCurrentPage(1);
      } else {
        setActiveFilters(prev => {
          const { q, ...rest } = prev;
          return rest;
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch news when filters or page change
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleSearch = () => {
    const newFilters: SearchParams = {};
    if (searchQuery.trim()) newFilters.q = searchQuery.trim();
    if (statusFilter !== 'ALL') newFilters.status = statusFilter;
    
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: NewsStatus | 'ALL') => {
    setStatusFilter(status);
    const newFilters: SearchParams = { ...activeFilters };
    if (status !== 'ALL') {
      newFilters.status = status;
    } else {
      delete newFilters.status;
    }
    
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const handleAiStatusChange = (aiStatus: 'ALL' | 'completed' | 'processing' | 'pending') => {
    setAiStatusFilter(aiStatus);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setActiveFilters({});
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handlePageInputChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const hasActiveFilters = useMemo(() => {
    return Object.keys(activeFilters).length > 0;
  }, [activeFilters]);

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

  const getAIProcessingStatus = (news: News) => {
    if (news.aiProcessed && news.aiContent) {
      return { status: 'completed', label: 'IA Processado', variant: 'default' as const };
    }
    if (news.aiProcessed && !news.aiContent) {
      return { status: 'processing', label: 'Processando IA...', variant: 'secondary' as const };
    }
    return { status: 'pending', label: 'Pendente IA', variant: 'outline' as const };
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

  // Funções de seleção múltipla
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedNews(new Set());
  };

  const toggleSelectAll = () => {
    if (selectedNews.size === news.length) {
      setSelectedNews(new Set());
    } else {
      setSelectedNews(new Set(news.map(item => item.id)));
    }
  };

  const toggleSelectNews = (newsId: string) => {
    const newSelected = new Set(selectedNews);
    if (newSelected.has(newsId)) {
      newSelected.delete(newsId);
    } else {
      newSelected.add(newsId);
    }
    setSelectedNews(newSelected);
  };

  // Ações em lote
  const bulkPublish = async () => {
    if (selectedNews.size === 0) return;
    
    try {
      setBulkActionLoading(true);
      const promises = Array.from(selectedNews).map(newsId => 
        apiClient.updateNews(newsId, { status: NewsStatus.PUBLISHED })
      );
      await Promise.all(promises);
      
      // Atualizar lista
      await fetchNews();
      setSelectedNews(new Set());
      toast.success(`${selectedNews.size} notícias publicadas com sucesso!`);
    } catch (error) {
      console.error('Error publishing news:', error);
      toast.error('Erro ao publicar notícias');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const bulkArchive = async () => {
    if (selectedNews.size === 0) return;
    
    try {
      setBulkActionLoading(true);
      const promises = Array.from(selectedNews).map(newsId => 
        apiClient.updateNews(newsId, { status: NewsStatus.ARCHIVED })
      );
      await Promise.all(promises);
      
      // Atualizar lista
      await fetchNews();
      setSelectedNews(new Set());
      toast.success(`${selectedNews.size} notícias arquivadas com sucesso!`);
    } catch (error) {
      console.error('Error archiving news:', error);
      toast.error('Erro ao arquivar notícias');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const bulkDelete = async () => {
    if (selectedNews.size === 0) return;
    
    if (!confirm(`Tem certeza que deseja excluir ${selectedNews.size} notícias?`)) {
      return;
    }
    
    try {
      setBulkActionLoading(true);
      const promises = Array.from(selectedNews).map(newsId => 
        apiClient.deleteNews(newsId)
      );
      await Promise.all(promises);
      
      // Atualizar lista
      await fetchNews();
      setSelectedNews(new Set());
      toast.success(`${selectedNews.size} notícias excluídas com sucesso!`);
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Erro ao excluir notícias');
    } finally {
      setBulkActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Filtros</span>
            <div className="flex items-center space-x-2">
              <Button
                variant={isSelectMode ? "default" : "outline"}
                onClick={toggleSelectMode}
              >
                {isSelectMode ? (
                  <>
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Sair da Seleção
                  </>
                ) : (
                  <>
                    <Square className="mr-2 h-4 w-4" />
                    Selecionar Múltiplas
                  </>
                )}
              </Button>
              <Button asChild>
                <Link href="/dashboard/news/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Notícia
                </Link>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar notícias..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os status</SelectItem>
                <SelectItem value={NewsStatus.DRAFT}>Rascunho</SelectItem>
                <SelectItem value={NewsStatus.PUBLISHED}>Publicado</SelectItem>
                <SelectItem value={NewsStatus.ARCHIVED}>Arquivado</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} variant="default">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Limpar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-blue-800">Filtros ativos:</span>
                {activeFilters.q && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Busca: "{activeFilters.q}"
                  </Badge>
                )}
                {activeFilters.status && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Status: {activeFilters.status === 'DRAFT' ? 'Rascunho' : 
                             activeFilters.status === 'PUBLISHED' ? 'Publicado' : 
                             activeFilters.status === 'ARCHIVED' ? 'Arquivado' : activeFilters.status}
                  </Badge>
                )}
              </div>
              <Button onClick={clearFilters} variant="ghost" size="sm">
                Limpar todos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions Bar */}
      {isSelectMode && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSelectAll}
                >
                  {selectedNews.size === news.length ? (
                    <>
                      <Square className="mr-2 h-4 w-4" />
                      Desmarcar Todas
                    </>
                  ) : (
                    <>
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Selecionar Todas
                    </>
                  )}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {selectedNews.size} de {news.length} selecionadas
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={bulkPublish}
                  disabled={bulkActionLoading || selectedNews.size === 0}
                  size="sm"
                >
                  {bulkActionLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Publicar ({selectedNews.size})
                </Button>
                
                <Button
                  onClick={bulkArchive}
                  disabled={bulkActionLoading || selectedNews.size === 0}
                  variant="outline"
                  size="sm"
                >
                  {bulkActionLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Archive className="mr-2 h-4 w-4" />
                  )}
                  Arquivar ({selectedNews.size})
                </Button>
                
                <Button
                  onClick={bulkDelete}
                  disabled={bulkActionLoading || selectedNews.size === 0}
                  variant="destructive"
                  size="sm"
                >
                  {bulkActionLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Excluir ({selectedNews.size})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* News List */}
      <div className="space-y-4">
        {news.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma notícia encontrada</p>
            </CardContent>
          </Card>
        ) : (
          news.map((item) => (
            <Card key={item.id} className={selectedNews.has(item.id) ? "ring-2 ring-blue-500 bg-blue-50" : ""}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  {isSelectMode && (
                    <div className="flex items-center mr-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSelectNews(item.id)}
                        className="p-1 h-8 w-8"
                      >
                        {selectedNews.has(item.id) ? (
                          <CheckSquare className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-4">
                      {item.imageUrl && (
                        <div className="w-24 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-semibold line-clamp-2">
                            {item.title}
                          </h3>
                          <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/news/${item.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/news/${item.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </Link>
                          </DropdownMenuItem>
                          {item.originalLink && (
                            <DropdownMenuItem asChild>
                              <a
                                href={item.originalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Link Original
                              </a>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {item.summary && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                            {item.summary}
                          </p>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDistanceToNow(new Date(item.createdAt), {
                                addSuffix: true,
                                locale: ptBR,
                              })}
                            </span>
                          </div>
                          {item.originalSource && (
                            <span>Fonte: {item.originalSource}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant={getStatusBadgeVariant(item.status)}>
                              {getStatusLabel(item.status)}
                            </Badge>
                            {(() => {
                              const aiStatus = getAIProcessingStatus(item);
                              return (
                                <Badge 
                                  variant={aiStatus.variant}
                                  className={`${
                                    aiStatus.status === 'completed' 
                                      ? 'bg-green-100 text-green-800 border-green-200' 
                                      : aiStatus.status === 'processing'
                                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                      : 'bg-gray-100 text-gray-600 border-gray-200'
                                  }`}
                                >
                                  {/* {aiStatus.status === 'completed' && '🤖 '}
                                  {aiStatus.status === 'processing' && '⏳ '}
                                  {aiStatus.status === 'pending' && '⏸️ '} */}
                                  {aiStatus.label}
                                </Badge>
                              );
                            })()}
                            {item.tags.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <Tag className="h-3 w-3" />
                                <span className="text-xs text-muted-foreground">
                                  {item.tags.slice(0, 3).join(', ')}
                                  {item.tags.length > 3 && ` +${item.tags.length - 3}`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, total)} de {total} notícias
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Itens por página:</span>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => handleItemsPerPageChange(parseInt(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center space-x-4">
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
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Ir para:</span>
              <Input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (!isNaN(page)) {
                    handlePageInputChange(page);
                  }
                }}
                className="w-16 h-8 text-center"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const page = parseInt((e.target as HTMLInputElement).value);
                    if (!isNaN(page)) {
                      handlePageInputChange(page);
                    }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
