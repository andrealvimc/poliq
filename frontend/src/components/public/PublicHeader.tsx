'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, Settings } from 'lucide-react';

export const PublicHeader: React.FC = () => {
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Poliq
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Início
              </Link>
              <Link href="/categorias" className="text-gray-600 hover:text-gray-900">
                Categorias
              </Link>
              <Link href="/sobre" className="text-gray-600 hover:text-gray-900">
                Sobre
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar notícias..."
                className="pl-10 w-64"
              />
            </div>
            
            <Button variant="outline" asChild>
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
