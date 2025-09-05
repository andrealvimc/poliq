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
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { ExternalSource } from '@/types';
import { toast } from 'sonner';

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
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">{source.name}</h3>
                      <Badge variant={source.isActive ? 'default' : 'secondary'}>
                        {source.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <ExternalLink className="h-4 w-4" />
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {source.url}
                        </a>
                      </div>
                      {source.lastFetch && (
                        <span>
                          Última busca: {new Date(source.lastFetch).toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
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
