'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowLeft,
  Calendar,
  Tag,
  ExternalLink,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  AlertTriangle,
} from 'lucide-react';
import { News, NewsStatus } from '@/types';

interface NewsViewProps {
  news: News;
}

export const NewsView: React.FC<NewsViewProps> = ({ news }) => {
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

  const shareOnSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(news.title);
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusBadgeVariant(news.status)}>
                {getStatusLabel(news.status)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Image */}
          {news.imageUrl && (
            <div className="aspect-video bg-gray-100">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <CardContent className="p-8">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {news.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDistanceToNow(new Date(news.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
              
              {news.originalSource && (
                <span>Fonte: {news.originalSource}</span>
              )}
              
              {news.publishedAt && (
                <span>
                  Publicado em: {new Date(news.publishedAt).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Tag className="h-4 w-4 text-gray-500" />
                {news.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Summary */}
            {news.summary && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-lg font-medium text-blue-900">
                  {news.summary}
                </p>
              </div>
            )}

            {/* Content */}
            <MarkdownRenderer 
              content={news.aiContent || news.content}
              className="text-gray-700 leading-relaxed"
            />
            
            {/* AI Disclaimer and Content Warning */}
            <div className="mt-6 space-y-4">
              {/* AI Disclaimer */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-bold">AI</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-800">
                          Conteúdo Reescrito por IA
                        </h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Este conteúdo foi reescrito por inteligência artificial com perspectiva editorial de direita, 
                          mantendo os fatos principais mas apresentando uma análise crítica e conservadora. 
                          Para informações completas e atualizadas, sempre consulte a fonte original.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content Warning if truncated */}
                  {news.content.length < 200 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">
                            Conteúdo limitado
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Este artigo pode ter conteúdo truncado. Para ler o texto completo, 
                            acesse a fonte original.
                          </p>
                          {news.originalLink && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              asChild
                            >
                              <a
                                href={news.originalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ler artigo completo
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
            </div>

            {/* Actions */}
            <Separator className="my-8" />
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-col space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Compartilhar esta notícia</h3>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => shareOnSocial('facebook')}
                      className="flex items-center space-x-2"
                    >
                      <Facebook className="h-4 w-4" />
                      <span>Facebook</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => shareOnSocial('twitter')}
                      className="flex items-center space-x-2"
                    >
                      <Twitter className="h-4 w-4" />
                      <span>Twitter</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => shareOnSocial('whatsapp')}
                      className="flex items-center space-x-2"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>WhatsApp</span>
                    </Button>
                  </div>
                </div>

                {news.originalLink && (
                  <Button variant="outline" asChild className="self-start">
                    <a
                      href={news.originalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Ver fonte original</span>
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </article>
      </div>
    </div>
  );
};
