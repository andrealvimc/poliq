import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Brain,
  Database,
  Globe,
  Shield,
  Zap,
  Users,
  Code,
  BarChart3,
  Newspaper,
  Bot,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sobre o Poliq
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uma plataforma inteligente de notícias que combina tecnologia de ponta 
              com inteligência artificial para entregar conteúdo relevante e atualizado.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Mission */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-blue-600" />
                Nossa Missão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 leading-relaxed">
                Democratizar o acesso à informação de qualidade através de uma plataforma 
                que utiliza inteligência artificial para processar, organizar e apresentar 
                notícias de forma inteligente e personalizada. Nosso objetivo é conectar 
                pessoas com o conhecimento que realmente importa.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Tecnologias Utilizadas
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Backend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-600" />
                  Backend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary">NestJS</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Prisma</Badge>
                  <Badge variant="secondary">PostgreSQL</Badge>
                  <Badge variant="secondary">Redis</Badge>
                  <Badge variant="secondary">Bull Queue</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  API robusta e escalável com arquitetura modular e processamento assíncrono.
                </p>
              </CardContent>
            </Card>

            {/* Frontend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Frontend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary">Next.js 15</Badge>
                  <Badge variant="secondary">React 18</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                  <Badge variant="secondary">Shadcn/ui</Badge>
                  <Badge variant="secondary">Server Components</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Interface moderna e responsiva com foco em performance e UX.
                </p>
              </CardContent>
            </Card>

            {/* AI & ML */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Inteligência Artificial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary">OpenAI GPT</Badge>
                  <Badge variant="secondary">Ollama</Badge>
                  <Badge variant="secondary">NLP</Badge>
                  <Badge variant="secondary">Content Processing</Badge>
                  <Badge variant="secondary">Image Generation</Badge>
                  <Badge variant="secondary">Text Analysis</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Processamento inteligente de conteúdo e geração de mídia.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Funcionalidades Principais
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-blue-600" />
                  Gestão de Notícias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Coleta automática de notícias de múltiplas fontes</li>
                  <li>• Processamento e categorização inteligente</li>
                  <li>• Sistema de tags e filtros avançados</li>
                  <li>• Editor de notícias integrado</li>
                  <li>• Controle de status (rascunho, publicado, arquivado)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-600" />
                  Processamento por IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Geração automática de resumos</li>
                  <li>• Criação de manchetes otimizadas</li>
                  <li>• Análise de sentimento e contexto</li>
                  <li>• Extração de palavras-chave</li>
                  <li>• Geração de comentários e análises</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Geração de Mídia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Criação automática de imagens</li>
                  <li>• Geração de cards para redes sociais</li>
                  <li>• Múltiplos formatos e tamanhos</li>
                  <li>• Templates personalizáveis</li>
                  <li>• Otimização automática de imagens</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Analytics e Monitoramento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Dashboard com métricas em tempo real</li>
                  <li>• Monitoramento de filas de processamento</li>
                  <li>• Estatísticas de publicação</li>
                  <li>• Relatórios de performance</li>
                  <li>• Alertas e notificações</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Architecture */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Code className="h-6 w-6 text-gray-600" />
                Arquitetura do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Backend (API)
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>NestJS</strong> - Framework Node.js robusto</li>
                    <li>• <strong>Prisma</strong> - ORM moderno para banco de dados</li>
                    <li>• <strong>PostgreSQL</strong> - Banco de dados principal</li>
                    <li>• <strong>Redis</strong> - Cache e sessões</li>
                    <li>• <strong>Bull Queue</strong> - Processamento assíncrono</li>
                    <li>• <strong>JWT</strong> - Autenticação segura</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Frontend (Portal)
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Next.js 15</strong> - Framework React com App Router</li>
                    <li>• <strong>Server Components</strong> - Renderização otimizada</li>
                    <li>• <strong>Tailwind CSS</strong> - Estilização utilitária</li>
                    <li>• <strong>Shadcn/ui</strong> - Componentes acessíveis</li>
                    <li>• <strong>TypeScript</strong> - Tipagem estática</li>
                    <li>• <strong>Responsive Design</strong> - Mobile-first</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Nossos Valores
          </h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle>Transparência</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Processamento transparente de conteúdo com disclaimers claros 
                  sobre o uso de IA e fontes originais.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle>Democratização</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Acesso livre e gratuito à informação de qualidade, 
                  sem barreiras tecnológicas ou econômicas.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle>Inovação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Uso de tecnologias de ponta para criar experiências 
                  únicas e eficientes de consumo de notícias.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Open Source */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Projeto Open Source
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  O Poliq é um projeto de código aberto disponível no GitHub. 
                  Contribua, reporte bugs ou simplesmente explore o código para 
                  entender como funciona nossa plataforma de notícias inteligentes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <a
                      href="https://github.com/andrealvimc/poliq"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Code className="mr-2 h-4 w-4" />
                      Ver no GitHub
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/">
                      Ver Notícias
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Poliq. Desenvolvido com ❤️ e inteligência artificial.
          </p>
        </div>
      </footer>
    </div>
  );
}
