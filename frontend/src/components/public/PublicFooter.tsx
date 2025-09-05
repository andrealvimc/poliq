'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Globe,
  Zap,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    noticias: [
      { name: 'Política', href: '/categoria/politica' },
      { name: 'Economia', href: '/categoria/economia' },
      { name: 'Tecnologia', href: '/categoria/tecnologia' },
      { name: 'Internacional', href: '/categoria/internacional' },
      { name: 'Brasil', href: '/categoria/brasil' },
    ],
    empresa: [
      { name: 'Sobre Nós', href: '/sobre' },
      { name: 'Contato', href: '/contato' },
      { name: 'Carreiras', href: '/carreiras' },
      { name: 'Imprensa', href: '/imprensa' },
      { name: 'Parcerias', href: '/parcerias' },
    ],
    recursos: [
      { name: 'API', href: '/api' },
      { name: 'RSS', href: '/rss' },
      { name: 'Newsletter', href: '/newsletter' },
      { name: 'App Mobile', href: '/app' },
      { name: 'Widgets', href: '/widgets' },
    ],
    legal: [
      { name: 'Termos de Uso', href: '/termos' },
      { name: 'Política de Privacidade', href: '/privacidade' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'DMCA', href: '/dmca' },
      { name: 'Acessibilidade', href: '/acessibilidade' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Poliq</h3>
                <p className="text-sm text-gray-400">Portal de Notícias</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              O Poliq é um portal de notícias inovador que utiliza inteligência artificial 
              para processar, analisar e apresentar as principais notícias do Brasil e do mundo 
              com perspectiva editorial de direita.
            </p>

            {/* Features */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>Processamento com IA</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span>Análise em tempo real</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Globe className="h-4 w-4 text-blue-400" />
                <span>Fontes confiáveis</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="font-semibold">Receba as notícias</h4>
              <div className="flex space-x-2">
                <Input
                  placeholder="Seu e-mail"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="font-semibold mb-4">Notícias</h4>
            <ul className="space-y-2">
              {footerLinks.noticias.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2">
              {footerLinks.recursos.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">50K+</div>
              <div className="text-sm text-gray-400">Notícias processadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">1M+</div>
              <div className="text-sm text-gray-400">Leitores mensais</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">24/7</div>
              <div className="text-sm text-gray-400">Atualizações</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">99.9%</div>
              <div className="text-sm text-gray-400">Disponibilidade</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © {currentYear} Poliq. Todos os direitos reservados.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Siga-nos:</span>
              <div className="flex space-x-3">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-4 text-sm">
              {footerLinks.legal.slice(0, 3).map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
