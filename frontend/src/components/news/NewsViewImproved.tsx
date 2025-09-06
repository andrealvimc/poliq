'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { Skeleton } from '@/components/ui/skeleton';
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
  Eye,
  Clock,
  User,
  Globe,
  BookOpen,
  TrendingUp,
  MessageCircle,
  Heart,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import { News, NewsStatus } from '@/types';
import { apiClient } from '@/lib/api';
import { usePopularNews } from '@/hooks/usePopularNews';
import { useNewsViews } from '@/hooks/useNewsViews';

interface NewsViewProps {
  news: News;
}

export const NewsViewImproved: React.FC<NewsViewProps> = ({ news }) => {
  const [views, setViews] = useState(news.views || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { popularNews, loading: popularLoading } = usePopularNews(5);

  // Usar hook personalizado para gerenciar views
  useNewsViews({
    newsId: news.id,
    initialViews: news.views || 0,
    onViewsUpdate: setViews,
  });

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = news.title;
    
    switch (platform) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
          console.error('Erro ao copiar:', err);
        }
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, '_blank');
        break;
    }
    setShowShareMenu(false);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const getStatusBadgeVariant = (status: NewsStatus) => {
    switch (status) {
      case NewsStatus.PUBLISHED:
        return 'default';
      case NewsStatus.DRAFT:
        return 'secondary';
      case NewsStatus.ARCHIVED:
        return 'destructive';
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

  // JSON-LD para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": news.title,
    "description": news.summary || news.aiSummary,
    "image": news.imageUrl ? [news.imageUrl] : [],
    "datePublished": news.createdAt,
    "dateModified": news.updatedAt,
    "author": {
      "@type": "Organization",
      "name": "Poliq"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Poliq",
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" asChild className="hover:bg-gray-100">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao Início
                </Link>
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`hover:bg-red-50 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBookmark}
                    className={`hover:bg-blue-50 ${isBookmarked ? 'text-blue-500' : 'text-gray-500'}`}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="hover:bg-gray-100"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  
                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                      <div className="py-2">
                        <button
                          onClick={() => handleShare('copy')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                          {isCopied ? 'Copiado!' : 'Copiar Link'}
                        </button>
                        <button
                          onClick={() => handleShare('facebook')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                          Facebook
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                          Twitter
                        </button>
                        <button
                          onClick={() => handleShare('whatsapp')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                {news.imageUrl && (
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant={getStatusBadgeVariant(news.status)} className="backdrop-blur-sm">
                        {getStatusLabel(news.status)}
                      </Badge>
                    </div>
                    {news.aiProcessed && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 backdrop-blur-sm">
                          🤖 Processado por IA
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                <CardContent className="p-8">
                  <header className="mb-8">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                      {news.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDistanceToNow(new Date(news.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">{views.toLocaleString()} visualizações</span>
                      </div>
                      
                      {news.originalSource && (
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>{news.originalSource}</span>
                        </div>
                      )}
                    </div>

                    {news.tags && news.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mb-6">
                        <Tag className="h-4 w-4 text-gray-500" />
                        {news.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="hover:bg-gray-50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </header>

                  {news.summary && (
                    <aside className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-6 mb-8 rounded-r-lg">
                      <div className="flex items-start space-x-3">
                        <BookOpen className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg font-semibold text-blue-900 mb-2">Resumo</h3>
                          <p className="text-blue-800 leading-relaxed">
                            {news.summary}
                          </p>
                        </div>
                      </div>
                    </aside>
                  )}

                  <main className="prose prose-lg max-w-none">
                    <MarkdownRenderer 
                      content={news.aiContent || news.content}
                      className="text-gray-700 leading-relaxed"
                    />
                  </main>

                  <Separator className="my-8" />

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-6 mb-8 rounded-r-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-lg font-semibold text-amber-900 mb-2">
                          Conteúdo Reescrito por IA
                        </h4>
                        <p className="text-amber-800 leading-relaxed">
                          Este conteúdo foi reescrito por inteligência artificial com perspectiva editorial de direita, 
                          mantendo os fatos principais mas apresentando uma análise crítica e conservadora. 
                          Para informações completas e atualizadas, sempre consulte a fonte original.
                        </p>
                      </div>
                    </div>
                  </div>

                  {news.originalLink && (
                    <div className="text-center">
                      <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                        <a
                          href={news.originalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center"
                        >
                          <ExternalLink className="mr-2 h-5 w-5" />
                          Ver Fonte Original
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Popular News */}
                <Card className="bg-white shadow-sm border">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-base text-gray-700">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span>Mais Lidas</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {popularLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex space-x-3">
                          <Skeleton className="w-5 h-5 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-2 w-2/3" />
                          </div>
                        </div>
                      ))
                    ) : (
                      popularNews.map((item, index) => (
                        <div key={item.id} className="group">
                          <Link href={`/news/${item.slug}`} className="block">
                            <div className="flex space-x-3 p-2 rounded-lg transition-all duration-200 group-hover:bg-white group-hover:shadow-sm group-hover:scale-[1.02] cursor-pointer">
                              <div className="flex-shrink-0 w-5 h-5 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs transition-all duration-200 group-hover:bg-blue-100 group-hover:text-blue-600 group-hover:scale-110">
                              {index + 1}
                            </div>
                            
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm text-gray-700 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 leading-relaxed">
                                  {item.title}
                                </h4>
                              
                                <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                                {item.tags && item.tags.length > 0 && (
                                    <div className="flex items-center space-x-1 group-hover:bg-blue-50 px-2 py-1 rounded-full transition-all duration-200">
                                      <Tag className="h-3 w-3 group-hover:text-blue-500 transition-colors duration-200" />
                                      <span className="truncate max-w-20 group-hover:text-blue-600 transition-colors duration-200">{item.tags[0]}</span>
                                  </div>
                                )}
                                
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3 group-hover:text-gray-600 transition-colors duration-200" />
                                    <span className="group-hover:text-gray-700 transition-colors duration-200">
                                    {formatDistanceToNow(new Date(item.createdAt), {
                                      addSuffix: true,
                                      locale: ptBR,
                                    })}
                                  </span>
                                </div>
                              </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        Newsletter
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Receba as principais notícias e análises diretamente no seu e-mail.
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <input 
                        type="email" 
                        placeholder="Digite seu e-mail" 
                        className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                      <Button className="w-full">
                        Assinar Newsletter
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Sem spam. Cancele quando quiser.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
