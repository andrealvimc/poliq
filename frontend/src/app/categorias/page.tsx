import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

const categories = [
  {
    id: 'politica',
    name: 'Política',
    description: 'Notícias sobre governo, eleições, congresso e política nacional',
    icon: Globe,
    color: 'bg-blue-100 text-blue-600',
    count: 45,
  },
  {
    id: 'economia',
    name: 'Economia',
    description: 'Mercado financeiro, negócios, inflação e indicadores econômicos',
    icon: TrendingUp,
    color: 'bg-green-100 text-green-600',
    count: 32,
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia',
    description: 'Inovações, startups, IA, gadgets e tendências tech',
    icon: Cpu,
    color: 'bg-purple-100 text-purple-600',
    count: 28,
  },
  {
    id: 'saude',
    name: 'Saúde',
    description: 'Medicina, bem-estar, pesquisas e políticas de saúde',
    icon: Heart,
    color: 'bg-red-100 text-red-600',
    count: 19,
  },
  {
    id: 'negocios',
    name: 'Negócios',
    description: 'Empresas, empreendedorismo, carreira e mercado de trabalho',
    icon: Briefcase,
    color: 'bg-yellow-100 text-yellow-600',
    count: 23,
  },
  {
    id: 'educacao',
    name: 'Educação',
    description: 'Ensino, universidades, pesquisas e políticas educacionais',
    icon: GraduationCap,
    color: 'bg-indigo-100 text-indigo-600',
    count: 15,
  },
  {
    id: 'automotivo',
    name: 'Automotivo',
    description: 'Carros, motos, lançamentos e indústria automotiva',
    icon: Car,
    color: 'bg-gray-100 text-gray-600',
    count: 12,
  },
  {
    id: 'imoveis',
    name: 'Imóveis',
    description: 'Construção, mercado imobiliário e financiamento',
    icon: Home,
    color: 'bg-orange-100 text-orange-600',
    count: 8,
  },
  {
    id: 'gastronomia',
    name: 'Gastronomia',
    description: 'Culinária, restaurantes, receitas e tendências gastronômicas',
    icon: Utensils,
    color: 'bg-pink-100 text-pink-600',
    count: 6,
  },
  {
    id: 'entretenimento',
    name: 'Entretenimento',
    description: 'Cinema, música, games, cultura e lazer',
    icon: Gamepad2,
    color: 'bg-cyan-100 text-cyan-600',
    count: 14,
  },
];

export default function CategoriasPage() {
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
                    <Link href={`/?categoria=${category.id}`}>
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
      </div>
    </div>
  );
}
