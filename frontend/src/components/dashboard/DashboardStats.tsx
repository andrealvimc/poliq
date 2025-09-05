'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Newspaper,
  CheckCircle,
  Edit3,
  Share2,
  Rss,
  AlertCircle,
  BarChart3,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { DashboardStats as DashboardStatsType } from '@/types';

export const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiClient.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total de Notícias',
      value: stats.totalNews,
      icon: Newspaper,
      description: 'Notícias no sistema',
      color: 'text-blue-600',
    },
    {
      title: 'Notícias Publicadas',
      value: stats.publishedNews,
      icon: CheckCircle,
      description: 'Disponíveis publicamente',
      color: 'text-green-600',
    },
    {
      title: 'Rascunhos',
      value: stats.draftNews,
      icon: Edit3,
      description: 'Aguardando publicação',
      color: 'text-yellow-600',
    },
    {
      title: 'Publicações',
      value: stats.totalPublications,
      icon: Share2,
      description: 'Em redes sociais',
      color: 'text-purple-600',
    },
    {
      title: 'Publicações Bem-sucedidas',
      value: stats.successfulPublications,
      icon: CheckCircle,
      description: 'Concluídas com sucesso',
      color: 'text-green-600',
    },
    {
      title: 'Publicações Falhadas',
      value: stats.failedPublications,
      icon: AlertCircle,
      description: 'Precisam de atenção',
      color: 'text-red-600',
    },
    {
      title: 'Fontes Ativas',
      value: stats.activeSources,
      icon: Rss,
      description: 'Provedores externos',
      color: 'text-orange-600',
    },
    {
      title: 'Filas Ativas',
      value: Array.isArray(stats.queueStats) ? stats.queueStats.filter(q => !q.paused).length : 0,
      icon: BarChart3,
      description: 'Processamento em andamento',
      color: 'text-indigo-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
