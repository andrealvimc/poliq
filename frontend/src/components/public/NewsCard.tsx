'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar, 
  ExternalLink, 
  ArrowRight, 
  Eye,
  MessageCircle,
  Clock
} from 'lucide-react';
import { News } from '@/types';

interface NewsCardProps {
  news: News;
  variant?: 'default' | 'compact' | 'featured';
}

export const NewsCard: React.FC<NewsCardProps> = ({ 
  news, 
  variant = 'default' 
}) => {
  if (variant === 'compact') {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300">
        <div className="flex space-x-4 p-4">
          {/* Image */}
          {news.imageUrl && (
            <div className="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
              <Link href={`/news/${news.slug}`}>
                {news.title}
              </Link>
            </h3>
            
            <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(news.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
              {news.originalSource && (
                <>
                  <span>•</span>
                  <span>{news.originalSource}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image */}
      {news.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-3">
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
                <>
                  <span>•</span>
                  <span className="font-medium">{news.originalSource}</span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-gray-400">
                <Eye className="h-4 w-4" />
                <span>{news.views?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold line-clamp-2 group-hover:text-blue-600 transition-colors">
            <Link href={`/news/${news.slug}`}>
              {news.title}
            </Link>
          </h3>

          {/* Summary */}
          {news.summary && (
            <p className="text-gray-600 line-clamp-3">
              {news.summary}
            </p>
          )}

          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {news.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {news.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{news.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" size="sm" asChild className="group-hover:bg-blue-50">
              <Link href={`/news/${news.slug}`}>
                Ler mais
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <div className="flex items-center space-x-2">
              {news.originalLink && (
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href={news.originalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
