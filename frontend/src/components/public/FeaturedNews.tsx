'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ExternalLink, ArrowRight, TrendingUp } from 'lucide-react';
import { News } from '@/types';

interface FeaturedNewsProps {
  news: News;
}

export const FeaturedNews: React.FC<FeaturedNewsProps> = ({ news }) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        {news.imageUrl && (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        )}
        
        {/* Featured Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-red-600 text-white hover:bg-red-700">
            <TrendingUp className="h-3 w-3 mr-1" />
            DESTAQUE
          </Badge>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="space-y-3">
            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {news.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h2 className="text-2xl lg:text-3xl font-bold leading-tight line-clamp-2">
              <Link 
                href={`/news/${news.slug}`}
                className="hover:text-blue-200 transition-colors"
              >
                {news.title}
              </Link>
            </h2>

            {/* Summary */}
            {news.summary && (
              <p className="text-lg text-gray-200 line-clamp-2">
                {news.summary}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-300">
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
                  <span className="font-medium">{news.originalSource}</span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <Link href={`/news/${news.slug}`}>
                    Ler mais
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                {news.originalLink && (
                  <Button variant="outline" size="sm" asChild className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <a
                      href={news.originalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
