'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  TrendingUp, 
  Calendar, 
  ExternalLink, 
  ArrowRight,
  Eye,
  MessageCircle,
  Share2,
  Search,
  X,
  Tag,
  Clock
} from 'lucide-react';
import { News } from '@/types';
import { usePopularNews } from '@/hooks/usePopularNews';

interface NewsSidebarProps {
  recentNews: News[];
}

export const NewsSidebar: React.FC<NewsSidebarProps> = ({ 
  recentNews 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { popularNews, loading: popularLoading } = usePopularNews(10);

  // Filtrar notícias populares baseado na busca
  const filteredPopularNews = popularNews.filter((item) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query))) ||
      (item.summary && item.summary.toLowerCase().includes(query))
    );
  });

  const handleSearch = () => {
    // A busca é feita em tempo real através do filteredPopularNews
  };

  const clearSearch = () => {
    setSearchQuery('');
  };
  return (
    <div className="space-y-6">
      {/* Popular News */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <TrendingUp className="h-5 w-5 text-red-600" />
            <span>Mais Lidas</span>
          </CardTitle>
        </CardHeader>
        
       
        <CardContent className="space-y-4">
          {popularLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex space-x-3">
                <Skeleton className="w-6 h-6 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))
          ) : (
            popularNews.map((item, index) => (
              <div key={item.id} className="group">
                <div className="flex space-x-3">
                  {/* Number */}
                  <div className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/news/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h4>
                    
                    <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{item.views?.toLocaleString() || 0}</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recent News */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Recentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentNews.slice(0, 4).map((item) => (
            <div key={item.id} className="group">
              <div className="flex space-x-3">
                {/* Image */}
                {item.imageUrl && (
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                    <Link href={`/news/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h4>
                  
                  <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                    <span>
                      {formatDistanceToNow(new Date(item.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                    {item.originalSource && (
                      <>
                        <span>•</span>
                        <span>{item.originalSource}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { name: 'Política', count: 45, color: 'bg-red-100 text-red-800' },
              { name: 'Economia', count: 32, color: 'bg-green-100 text-green-800' },
              { name: 'Tecnologia', count: 28, color: 'bg-blue-100 text-blue-800' },
              { name: 'Internacional', count: 23, color: 'bg-purple-100 text-purple-800' },
              { name: 'Brasil', count: 19, color: 'bg-yellow-100 text-yellow-800' },
              { name: 'Esportes', count: 15, color: 'bg-orange-100 text-orange-800' },
            ].map((category) => (
              <Link key={category.name} href={`/categoria/${category.name.toLowerCase()}`}>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={category.color}>
                      {category.name}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">{category.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Receba as notícias</h3>
            <p className="text-sm text-gray-600">
              Fique por dentro das principais notícias processadas com IA
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Share2 className="h-4 w-4 mr-2" />
              Inscrever-se
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

