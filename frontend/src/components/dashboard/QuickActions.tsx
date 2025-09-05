'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Bot,
  Image,
  Rss,
  Share2,
  BarChart3,
} from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'outline' | 'secondary';
}

const quickActions: QuickAction[] = [
  {
    title: 'Nova Notícia',
    description: 'Criar uma nova notícia',
    href: '/dashboard/news/new',
    icon: Plus,
    variant: 'default',
  },
  {
    title: 'Processar com IA',
    description: 'Usar IA para processar conteúdo',
    href: '/dashboard/ai',
    icon: Bot,
    variant: 'outline',
  },
  {
    title: 'Gerar Imagem',
    description: 'Criar imagem para notícia',
    href: '/dashboard/media',
    icon: Image,
    variant: 'outline',
  },
  {
    title: 'Buscar Notícias',
    description: 'Buscar em fontes externas',
    href: '/dashboard/providers',
    icon: Rss,
    variant: 'outline',
  },
  {
    title: 'Publicar',
    description: 'Publicar em redes sociais',
    href: '/dashboard/publications',
    icon: Share2,
    variant: 'outline',
  },
  {
    title: 'Monitorar Filas',
    description: 'Ver status das filas',
    href: '/dashboard/queues',
    icon: BarChart3,
    variant: 'outline',
  },
];

export const QuickActions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              className="w-full justify-start h-auto p-4"
              asChild
            >
              <Link href={action.href}>
                <div className="flex items-start space-x-3">
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};
