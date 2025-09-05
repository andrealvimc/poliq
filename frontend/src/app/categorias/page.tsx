'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Globe,
  TrendingUp,
  Cpu,
  Heart,
  Briefcase,
  GraduationCap,
  Car,
  Home,
  Utensils,
  Gamepad2,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

interface CategoryData {
  category: string;
  count: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  count: number;
}

const categoryConfig: Record<string, { name: string; description: string; icon: any; color: string }> = {
  politica: {
    name: 'Política',
    description: 'Notícias sobre governo, eleições, congresso e política nacional',
    icon: Globe,
    color: 'bg-blue-100 text-blue-600',
  },
  economia: {
    name: 'Economia',
    description: 'Mercado financeiro, negócios, inflação e indicadores econômicos',
    icon: TrendingUp,
    color: 'bg-green-100 text-green-600',
  },
  tecnologia: {
    name: 'Tecnologia',
    description: 'Inovações, startups, IA, gadgets e tendências tech',
    icon: Cpu,
    color: 'bg-purple-100 text-purple-600',
  },
  saude: {
    name: 'Saúde',
    description: 'Medicina, bem-estar, pesquisas e políticas de saúde',
    icon: Heart,
    color: 'bg-red-100 text-red-600',
  },
  negocios: {
    name: 'Negócios',
    description: 'Empresas, empreendedorismo, carreira e mercado de trabalho',
    icon: Briefcase,
    color: 'bg-yellow-100 text-yellow-600',
  },
  educacao: {
    name: 'Educação',
    description: 'Ensino, universidades, pesquisas e políticas educacionais',
    icon: GraduationCap,
    color: 'bg-indigo-100 text-indigo-600',
  },
  automotivo: {
    name: 'Automotivo',
    description: 'Carros, motos, lançamentos e indústria automotiva',
    icon: Car,
    color: 'bg-gray-100 text-gray-600',
  },
  imoveis: {
    name: 'Imóveis',
    description: 'Construção, mercado imobiliário e financiamento',
    icon: Home,
    color: 'bg-orange-100 text-orange-600',
  },
  gastronomia: {
    name: 'Gastronomia',
    description: 'Culinária, restaurantes, receitas e tendências gastronômicas',
    icon: Utensils,
    color: 'bg-pink-100 text-pink-600',
  },
  entretenimento: {
    name: 'Entretenimento',
    description: 'Cinema, música, games, cultura e lazer',
    icon: Gamepad2,
    color: 'bg-cyan-100 text-cyan-600',
  },
  esportes: {
    name: 'Esportes',
    description: 'Futebol, olimpíadas, competições e atletas',
    icon: Gamepad2,
    color: 'bg-emerald-100 text-emerald-600',
  },
  cultura: {
    name: 'Cultura',
    description: 'Arte, música, cinema, teatro e manifestações culturais',
    icon: Gamepad2,
    color: 'bg-violet-100 text-violet-600',
  },
  meioambiente: {
    name: 'Meio Ambiente',
    description: 'Sustentabilidade, clima, natureza e preservação',
    icon: Globe,
    color: 'bg-teal-100 text-teal-600',
  },
  seguranca: {
    name: 'Segurança',
    description: 'Crime, violência, polícia e segurança pública',
    icon: Heart,
    color: 'bg-rose-100 text-rose-600',
  },
  internacional: {
    name: 'Internacional',
    description: 'Notícias do mundo, política internacional e global',
    icon: Globe,
    color: 'bg-sky-100 text-sky-600',
  },
};

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoryStats = await apiClient.getCategoryStats();
        
        // Map the stats to categories with configuration
        const mappedCategories: Category[] = categoryStats
          .map((stat) => {
            const config = categoryConfig[stat.category];
            if (!config) return null;
            
            return {
              id: stat.category,
              name: config.name,
              description: config.description,
              icon: config.icon,
              color: config.color,
              count: stat.count,
            };
          })
          .filter((cat): cat is Category => cat !== null)
          .sort((a, b) => b.count - a.count);

        setCategories(mappedCategories);
      } catch (err) {
        setError('Erro ao carregar categorias');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <Skeleton className="h-10 w-80 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Erro</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Categorias de Notícias
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore notícias organizadas por temas e encontre exatamente 
              o que você está procurando.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {categories.length > 0 ? (
          <>
            {/* Categories Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-lg ${category.color}`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary">
                          {category.count} artigos
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        {category.description}
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/categoria/${category.id}`}>
                          Ver Notícias
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* All News CTA */}
            <div className="mt-16 text-center">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="py-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Não encontrou o que procura?
                  </h2>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Explore todas as notícias em nossa página principal e use 
                    nossa busca inteligente para encontrar conteúdo específico.
                  </p>
                  <Button size="lg" asChild>
                    <Link href="/">
                      Ver Todas as Notícias
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Nenhuma categoria encontrada
              </h2>
              <p className="text-gray-600 mb-6">
                Não há categorias disponíveis no momento.
              </p>
              <Button asChild>
                <Link href="/">
                  Ver Todas as Notícias
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
