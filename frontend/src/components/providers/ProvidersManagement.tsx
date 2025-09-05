'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Rss,
  RefreshCw,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Globe,
  Database,
  MessageSquare,
  Twitter,
  Settings,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { ExternalSource, SourceType } from '@/types';
import { toast } from 'sonner';
import { SourcesStats } from './SourcesStats';

const getSourceIcon = (type: SourceType) => {
  switch (type) {
    case SourceType.RSS_FEED:
      return <Rss className="h-5 w-5" />;
    case SourceType.GNEWS_API:
    case SourceType.NEWSAPI_ORG:
      return <Globe className="h-5 w-5" />;
    case SourceType.REDDIT_API:
      return <MessageSquare className="h-5 w-5" />;
    case SourceType.TWITTER_API:
      return <Twitter className="h-5 w-5" />;
    case SourceType.SOCIAL_MEDIA:
      return <ExternalLink className="h-5 w-5" />;
    default:
      return <Settings className="h-5 w-5" />;
  }
};

const getSourceTypeLabel = (type: SourceType) => {
  switch (type) {
    case SourceType.RSS_FEED:
      return 'RSS Feed';
    case SourceType.GNEWS_API:
      return 'GNews API';
    case SourceType.NEWSAPI_ORG:
      return 'NewsAPI.org';
    case SourceType.REDDIT_API:
      return 'Reddit API';
    case SourceType.TWITTER_API:
      return 'Twitter API';
    case SourceType.SOCIAL_MEDIA:
      return 'Social Media';
    case SourceType.WEB_SCRAPER:
      return 'Web Scraper';
    default:
      return 'Unknown';
  }
};

export const ProvidersManagement: React.FC = () => {
  const [sources, setSources] = useState<ExternalSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getSources();
      setSources(data);
    } catch (error) {
      console.error('Error fetching sources:', error);
      toast.error('Erro ao carregar fontes');
    } finally {
      setLoading(false);
    }
  };

  const toggleSource = async (sourceId: string) => {
    try {
      const updatedSource = await apiClient.toggleSourceActive(sourceId);
      setSources(prev => 
        prev.map(source => 
          source.id === sourceId ? updatedSource : source
        )
      );
      toast.success('Status da fonte atualizado');
    } catch (error) {
      console.error('Error toggling source:', error);
      toast.error('Erro ao atualizar fonte');
    }
  };

  const fetchAllNews = async () => {
    try {
      setFetching(true);
      const result = await apiClient.fetchNewsFromAllSources();
      toast.success(`${result.count} notícias encontradas`);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Erro ao buscar notícias');
    } finally {
      setFetching(false);
    }
  };

  const fetchAndProcessNews = async () => {
    try {
      setFetching(true);
      const result = await apiClient.fetchAndProcessNews();
      toast.success('Notícias buscadas e processadas com sucesso');
    } catch (error) {
      console.error('Error fetching and processing news:', error);
      toast.error('Erro ao buscar e processar notícias');
    } finally {
      setFetching(false);
    }
  };

  const reprocessFailedNews = async () => {
    try {
      setFetching(true);
      const result = await apiClient.reprocessFailedNews();
      toast.success('Notícias com falha foram reprocessadas');
    } catch (error) {
      console.error('Error reprocessing failed news:', error);
      toast.error('Erro ao reprocessar notícias');
    } finally {
      setFetching(false);
    }
  };

  const testSource = async (sourceId: string) => {
    try {
      setFetching(true);
      const result = await apiClient.testSource(sourceId);
      toast.success(`${result.count} notícias encontradas na fonte`);
    } catch (error) {
      console.error('Error testing source:', error);
      toast.error('Erro ao testar fonte');
    } finally {
      setFetching(false);
    }
  };

  const testRSSFeeds = async (category?: string) => {
    try {
      setFetching(true);
      const result = await apiClient.testRSSFeeds(category);
      toast.success(`${result.count} notícias encontradas nos RSS feeds`);
    } catch (error) {
      console.error('Error testing RSS feeds:', error);
      toast.error('Erro ao testar RSS feeds');
    } finally {
      setFetching(false);
    }
  };

  const testAllSources = async () => {
    try {
      setFetching(true);
      const result = await apiClient.testAllSources();
      toast.success('Teste de todas as fontes concluído');
    } catch (error) {
      console.error('Error testing all sources:', error);
      toast.error('Erro ao testar fontes');
    } finally {
      setFetching(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={fetchAllNews}
              disabled={fetching}
              variant="outline"
            >
              {fetching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Rss className="mr-2 h-4 w-4" />
                  Buscar Notícias
                </>
              )}
            </Button>

            <Button
              onClick={fetchAndProcessNews}
              disabled={fetching}
            >
              {fetching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Buscar e Processar
                </>
              )}
            </Button>

            <Button
              onClick={reprocessFailedNews}
              disabled={fetching}
              variant="outline"
            >
              {fetching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reprocessando...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Reprocessar Falhas
                </>
              )}
            </Button>

            <Button
              onClick={() => testRSSFeeds()}
              disabled={fetching}
              variant="outline"
            >
              {fetching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <Rss className="mr-2 h-4 w-4" />
                  Testar RSS
                </>
              )}
            </Button>

            <Button
              onClick={testAllSources}
              disabled={fetching}
              variant="outline"
            >
              {fetching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <Settings className="mr-2 h-4 w-4" />
                  Testar Todas
                </>
              )}
            </Button>
          </div>

          {fetching && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Processando fontes externas... Aguarde um momento.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Sources Stats */}
      <SourcesStats sources={sources} />

      {/* Sources List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Fontes Externas</h2>
        
        {sources.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma fonte encontrada</p>
            </CardContent>
          </Card>
        ) : (
          sources.map((source) => (
            <Card key={source.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getSourceIcon(source.type)}
                        <h3 className="text-lg font-semibold">{source.name}</h3>
                      </div>
                      <Badge variant={source.isActive ? 'default' : 'secondary'}>
                        {source.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <Badge variant="outline">
                        {getSourceTypeLabel(source.type)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {source.baseUrl && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <ExternalLink className="h-4 w-4" />
                          <a
                            href={source.baseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {source.baseUrl}
                          </a>
                        </div>
                      )}
                      
                      {source.config && (
                        <div className="text-sm text-muted-foreground">
                          <strong>Configuração:</strong>
                          {source.type === SourceType.RSS_FEED && source.config.sources && (
                            <span className="ml-2">
                              {source.config.sources.length} fontes RSS
                              {source.config.category && ` (${source.config.category})`}
                            </span>
                          )}
                          {source.type === SourceType.GNEWS_API && (
                            <span className="ml-2">
                              {source.config.language?.toUpperCase()}/{source.config.country?.toUpperCase()}
                              {source.config.max && ` • Max: ${source.config.max}`}
                            </span>
                          )}
                          {source.type === SourceType.NEWSAPI_ORG && (
                            <span className="ml-2">
                              {source.config.language?.toUpperCase()}/{source.config.country?.toUpperCase()}
                              {source.config.max && ` • Max: ${source.config.max}`}
                            </span>
                          )}
                          {source.type === SourceType.REDDIT_API && source.config.subreddits && (
                            <span className="ml-2">
                              r/{source.config.subreddits.join(', r/')}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {source.lastFetch && (
                        <div className="text-sm text-muted-foreground">
                          <strong>Última busca:</strong> {new Date(source.lastFetch).toLocaleString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={() => testSource(source.id)}
                      disabled={fetching}
                      variant="outline"
                      size="sm"
                    >
                      {fetching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Ativo</span>
                      <Switch
                        checked={source.isActive}
                        onCheckedChange={() => toggleSource(source.id)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
