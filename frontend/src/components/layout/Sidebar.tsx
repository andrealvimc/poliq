'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Newspaper,
  Bot,
  Image,
  Rss,
  Share2,
  BarChart3,
  Settings,
  Users,
  Globe,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  requiredRole?: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Notícias',
    href: '/dashboard/news',
    icon: Newspaper,
    requiredRole: 'EDITOR',
  },
  {
    title: 'IA & Processamento',
    href: '/dashboard/ai',
    icon: Bot,
    requiredRole: 'EDITOR',
  },
  {
    title: 'Mídia',
    href: '/dashboard/media',
    icon: Image,
    requiredRole: 'EDITOR',
  },
  {
    title: 'Provedores',
    href: '/dashboard/providers',
    icon: Rss,
    requiredRole: 'EDITOR',
  },
  {
    title: 'Publicações',
    href: '/dashboard/publications',
    icon: Share2,
    requiredRole: 'EDITOR',
  },
  {
    title: 'Filas',
    href: '/dashboard/queues',
    icon: BarChart3,
    requiredRole: 'ADMIN',
  },
  {
    title: 'Portal Público',
    href: '/',
    icon: Globe,
  },
];

const adminItems: SidebarItem[] = [
  {
    title: 'Usuários',
    href: '/dashboard/users',
    icon: Users,
    requiredRole: 'ADMIN',
  },
  {
    title: 'Configurações',
    href: '/dashboard/settings',
    icon: Settings,
    requiredRole: 'ADMIN',
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const canAccess = (item: SidebarItem): boolean => {
    if (!item.requiredRole) return true;
    if (!user) return false;
    
    const roleHierarchy = {
      VIEWER: 1,
      EDITOR: 2,
      ADMIN: 3,
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[item.requiredRole];
  };

  const filteredItems = sidebarItems.filter(canAccess);
  const filteredAdminItems = adminItems.filter(canAccess);

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold">Poliq Admin</h1>
      </div>
      
      <Separator className="bg-gray-700" />
      
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start text-left',
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.title}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {filteredAdminItems.length > 0 && (
          <>
            <Separator className="my-4 bg-gray-700" />
            <nav className="space-y-1">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Administração
              </p>
              {filteredAdminItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start text-left',
                        isActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      )}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.title}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </>
        )}
      </ScrollArea>
    </div>
  );
};
