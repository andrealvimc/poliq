'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalSource, SourceType } from '@/types';
import { Rss, Globe, MessageSquare, Twitter, Settings } from 'lucide-react';

interface SourcesStatsProps {
  sources: ExternalSource[];
}

const getSourceIcon = (type: SourceType) => {
  switch (type) {
    case SourceType.RSS_FEED:
      return <Rss className="h-4 w-4" />;
    case SourceType.GNEWS_API:
    case SourceType.NEWSAPI_ORG:
      return <Globe className="h-4 w-4" />;
    case SourceType.REDDIT_API:
      return <MessageSquare className="h-4 w-4" />;
    case SourceType.TWITTER_API:
      return <Twitter className="h-4 w-4" />;
    default:
      return <Settings className="h-4 w-4" />;
  }
};

export const SourcesStats: React.FC<SourcesStatsProps> = ({ sources }) => {
  const activeSources = sources.filter(source => source.isActive);
  const inactiveSources = sources.filter(source => !source.isActive);
  
  const sourcesByType = sources.reduce((acc, source) => {
    acc[source.type] = (acc[source.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const rssSources = sources.filter(source => source.type === SourceType.RSS_FEED);
  const totalRSSFeeds = rssSources.reduce((total, source) => {
    return total + (source.config?.sources?.length || 0);
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total de Fontes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sources.length}</div>
          <p className="text-xs text-muted-foreground">
            {activeSources.length} ativas, {inactiveSources.length} inativas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">RSS Feeds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRSSFeeds}</div>
          <p className="text-xs text-muted-foreground">
            {rssSources.length} categorias configuradas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">APIs Externas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {sourcesByType[SourceType.GNEWS_API] || 0 + sourcesByType[SourceType.NEWSAPI_ORG] || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            GNews + NewsAPI
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Redes Sociais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(sourcesByType[SourceType.REDDIT_API] || 0) + (sourcesByType[SourceType.TWITTER_API] || 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            Reddit + Twitter
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Distribuição por Tipo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(sourcesByType).map(([type, count]) => (
              <Badge key={type} variant="outline" className="flex items-center gap-1">
                {getSourceIcon(type as SourceType)}
                {type.replace('_', ' ')}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
