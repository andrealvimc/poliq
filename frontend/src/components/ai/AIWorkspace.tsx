'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Bot,
  FileText,
  Tag,
  Hash,
  MessageSquare,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

const aiSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  source: z.string().optional(),
});

type AIFormData = z.infer<typeof aiSchema>;

interface AIResult {
  summary?: string;
  headline?: string;
  tags?: string[];
  commentary?: string;
  keywords?: string[];
}

export const AIWorkspace: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIResult>({});
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AIFormData>({
    resolver: zodResolver(aiSchema),
  });

  const watchedTitle = watch('title');
  const watchedContent = watch('content');

  const copyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(item);
      toast.success('Copiado para a área de transferência');
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      toast.error('Erro ao copiar');
    }
  };

  const generateSummary = async () => {
    if (!watchedTitle || !watchedContent) {
      toast.error('Título e conteúdo são necessários');
      return;
    }

    try {
      setLoading(true);
      const result = await apiClient.generateSummary({
        title: watchedTitle,
        content: watchedContent,
      });
      setResults(prev => ({ ...prev, summary: result.summary }));
      toast.success('Resumo gerado com sucesso');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Erro ao gerar resumo');
    } finally {
      setLoading(false);
    }
  };

  const generateHeadline = async () => {
    if (!watchedTitle || !watchedContent) {
      toast.error('Título e conteúdo são necessários');
      return;
    }

    try {
      setLoading(true);
      const result = await apiClient.generateHeadline({
        title: watchedTitle,
        content: watchedContent,
      });
      setResults(prev => ({ ...prev, headline: result.headline }));
      toast.success('Headline gerada com sucesso');
    } catch (error) {
      console.error('Error generating headline:', error);
      toast.error('Erro ao gerar headline');
    } finally {
      setLoading(false);
    }
  };

  const generateTags = async () => {
    if (!watchedTitle || !watchedContent) {
      toast.error('Título e conteúdo são necessários');
      return;
    }

    try {
      setLoading(true);
      const result = await apiClient.generateTags({
        title: watchedTitle,
        content: watchedContent,
      });
      setResults(prev => ({ ...prev, tags: result.tags }));
      toast.success('Tags geradas com sucesso');
    } catch (error) {
      console.error('Error generating tags:', error);
      toast.error('Erro ao gerar tags');
    } finally {
      setLoading(false);
    }
  };

  const generateCommentary = async () => {
    if (!watchedTitle || !watchedContent) {
      toast.error('Título e conteúdo são necessários');
      return;
    }

    try {
      setLoading(true);
      const result = await apiClient.generateCommentary({
        title: watchedTitle,
        content: watchedContent,
        originalSource: watch('source'),
      });
      setResults(prev => ({ ...prev, commentary: result.commentary }));
      toast.success('Comentário gerado com sucesso');
    } catch (error) {
      console.error('Error generating commentary:', error);
      toast.error('Erro ao gerar comentário');
    } finally {
      setLoading(false);
    }
  };

  const extractKeywords = async () => {
    if (!watchedContent) {
      toast.error('Conteúdo é necessário');
      return;
    }

    try {
      setLoading(true);
      const result = await apiClient.extractKeywords({
        text: watchedContent,
      });
      setResults(prev => ({ ...prev, keywords: result.keywords }));
      toast.success('Palavras-chave extraídas com sucesso');
    } catch (error) {
      console.error('Error extracting keywords:', error);
      toast.error('Erro ao extrair palavras-chave');
    } finally {
      setLoading(false);
    }
  };

  const processAll = async () => {
    if (!watchedTitle || !watchedContent) {
      toast.error('Título e conteúdo são necessários');
      return;
    }

    try {
      setLoading(true);
      const result = await apiClient.processNewsContent({
        title: watchedTitle,
        content: watchedContent,
        originalSource: watch('source'),
      });

      setResults({
        summary: result.summary,
        headline: result.processedTitle,
        tags: result.tags,
        commentary: result.commentary,
        keywords: result.keywords,
      });

      toast.success('Processamento completo realizado com sucesso');
    } catch (error) {
      console.error('Error processing with AI:', error);
      toast.error('Erro no processamento completo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="input" className="space-y-6">
        <TabsList>
          <TabsTrigger value="input">Entrada</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="mr-2 h-5 w-5" />
                Entrada de Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Digite o título da notícia"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo *</Label>
                  <Textarea
                    id="content"
                    {...register('content')}
                    placeholder="Digite o conteúdo da notícia"
                    rows={8}
                  />
                  {errors.content && (
                    <p className="text-sm text-red-600">{errors.content.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Fonte (opcional)</Label>
                  <Input
                    id="source"
                    {...register('source')}
                    placeholder="Nome da fonte original"
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ferramentas de IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button
                  onClick={generateSummary}
                  disabled={loading || !watchedTitle || !watchedContent}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <FileText className="h-6 w-6" />
                  <span>Gerar Resumo</span>
                </Button>

                <Button
                  onClick={generateHeadline}
                  disabled={loading || !watchedTitle || !watchedContent}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Hash className="h-6 w-6" />
                  <span>Gerar Headline</span>
                </Button>

                <Button
                  onClick={generateTags}
                  disabled={loading || !watchedTitle || !watchedContent}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Tag className="h-6 w-6" />
                  <span>Gerar Tags</span>
                </Button>

                <Button
                  onClick={generateCommentary}
                  disabled={loading || !watchedTitle || !watchedContent}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <MessageSquare className="h-6 w-6" />
                  <span>Gerar Comentário</span>
                </Button>

                <Button
                  onClick={extractKeywords}
                  disabled={loading || !watchedContent}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Hash className="h-6 w-6" />
                  <span>Extrair Palavras-chave</span>
                </Button>

                <Button
                  onClick={processAll}
                  disabled={loading || !watchedTitle || !watchedContent}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Bot className="h-6 w-6" />
                  <span>Processar Tudo</span>
                </Button>
              </div>

              {loading && (
                <Alert>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertDescription>
                    Processando com IA... Aguarde um momento.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {Object.keys(results).length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Nenhum resultado ainda. Use as ferramentas de IA para gerar conteúdo.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {results.summary && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Resumo
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results.summary!, 'summary')}
                    >
                      {copiedItem === 'summary' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{results.summary}</p>
                  </CardContent>
                </Card>
              )}

              {results.headline && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Hash className="mr-2 h-5 w-5" />
                      Headline
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results.headline!, 'headline')}
                    >
                      {copiedItem === 'headline' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium">{results.headline}</p>
                  </CardContent>
                </Card>
              )}

              {results.tags && results.tags.length > 0 && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Tag className="mr-2 h-5 w-5" />
                      Tags
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results.tags!.join(', '), 'tags')}
                    >
                      {copiedItem === 'tags' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {results.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {results.commentary && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Comentário
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results.commentary!, 'commentary')}
                    >
                      {copiedItem === 'commentary' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{results.commentary}</p>
                  </CardContent>
                </Card>
              )}

              {results.keywords && results.keywords.length > 0 && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Hash className="mr-2 h-5 w-5" />
                      Palavras-chave
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results.keywords!.join(', '), 'keywords')}
                    >
                      {copiedItem === 'keywords' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {results.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
