'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Share2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Publication, PublicationStatus } from '@/types';
import { toast } from 'sonner';

export const PublicationsManagement: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNewsId, setSelectedNewsId] = useState<string>('');

  useEffect(() => {
    fetchPublications();
  }, [selectedNewsId]);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getPublications(selectedNewsId || undefined);
      setPublications(data);
    } catch (error) {
      console.error('Error fetching publications:', error);
      toast.error('Erro ao carregar publicações');
    } finally {
      setLoading(false);
    }
  };

  const retryPublication = async (publicationId: string) => {
    try {
      await apiClient.retryPublication(publicationId);
      toast.success('Publicação reprocessada');
      fetchPublications();
    } catch (error) {
      console.error('Error retrying publication:', error);
      toast.error('Erro ao reprocessar publicação');
    }
  };

  const getStatusBadgeVariant = (status: PublicationStatus) => {
    switch (status) {
      case PublicationStatus.PUBLISHED:
        return 'default';
      case PublicationStatus.PENDING:
        return 'secondary';
      case PublicationStatus.FAILED:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: PublicationStatus) => {
    switch (status) {
      case PublicationStatus.PUBLISHED:
        return 'Publicado';
      case PublicationStatus.PENDING:
        return 'Pendente';
      case PublicationStatus.FAILED:
        return 'Falhou';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusIcon = (status: PublicationStatus) => {
    switch (status) {
      case PublicationStatus.PUBLISHED:
        return <CheckCircle className="h-4 w-4" />;
      case PublicationStatus.PENDING:
        return <Clock className="h-4 w-4" />;
      case PublicationStatus.FAILED:
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Select value={selectedNewsId} onValueChange={setSelectedNewsId}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por notícia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as publicações</SelectItem>
                  {/* Aqui você poderia carregar uma lista de notícias */}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={fetchPublications} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Publications List */}
      <div className="space-y-4">
        {publications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma publicação encontrada</p>
            </CardContent>
          </Card>
        ) : (
          publications.map((publication) => (
            <Card key={publication.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">
                        Notícia: {publication.newsId}
                      </h3>
                      <Badge variant={getStatusBadgeVariant(publication.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(publication.status)}
                          <span>{getStatusLabel(publication.status)}</span>
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Plataforma: {publication.platform}</span>
                      {publication.publishedAt && (
                        <span>
                          Publicado em: {new Date(publication.publishedAt).toLocaleString('pt-BR')}
                        </span>
                      )}
                      {publication.url && (
                        <a
                          href={publication.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Ver publicação</span>
                        </a>
                      )}
                    </div>

                    {publication.error && (
                      <div className="text-sm text-red-600">
                        Erro: {publication.error}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {publication.status === PublicationStatus.FAILED && (
                      <Button
                        onClick={() => retryPublication(publication.id)}
                        variant="outline"
                        size="sm"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reprocessar
                      </Button>
                    )}
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
