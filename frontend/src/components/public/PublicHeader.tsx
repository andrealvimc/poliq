'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  User, 
  Menu, 
  X, 
  Bell, 
  TrendingUp,
  Globe,
  Shield,
  Zap
} from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Política', href: '/categoria/politica', color: 'bg-red-100 text-red-800' },
    { name: 'Economia', href: '/categoria/economia', color: 'bg-green-100 text-green-800' },
    { name: 'Tecnologia', href: '/categoria/tecnologia', color: 'bg-blue-100 text-blue-800' },
    { name: 'Internacional', href: '/categoria/internacional', color: 'bg-purple-100 text-purple-800' },
    { name: 'Brasil', href: '/categoria/brasil', color: 'bg-yellow-100 text-yellow-800' },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Notícias processadas com IA</span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Fonte confiável</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</span>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Poliq</h1>
                <p className="text-xs text-gray-500 -mt-1">Portal de Notícias</p>
              </div>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Início
              </Link>
              <Link href="/categorias" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Categorias
              </Link>
              <Link href="/sobre" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Sobre
              </Link>
              <Link href="/contato" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Contato
              </Link>
            </nav>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar notícias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {/* Login Button */}
            {/* <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button> */}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="hidden md:block mt-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Categorias:</span>
            {categories.map((category) => (
              <Link key={category.name} href={category.href}>
                <Badge variant="outline" className={`${category.color} hover:opacity-80 transition-opacity`}>
                  {category.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar notícias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            
            <nav className="space-y-2">
              <Link href="/" className="block py-2 text-gray-700 hover:text-blue-600">
                Início
              </Link>
              <Link href="/categorias" className="block py-2 text-gray-700 hover:text-blue-600">
                Categorias
              </Link>
              <Link href="/sobre" className="block py-2 text-gray-700 hover:text-blue-600">
                Sobre
              </Link>
              <Link href="/contato" className="block py-2 text-gray-700 hover:text-blue-600">
                Contato
              </Link>
            </nav>

            <div className="pt-4 border-t">
              {/* <Button variant="outline" asChild className="w-full">
                <Link href="/login">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button> */}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
