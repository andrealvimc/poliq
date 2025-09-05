'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Loader2,
  Save,
  ArrowLeft,
  Bot,
  Image,
  Tag,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { News, NewsStatus, CreateNewsRequest, UpdateNewsRequest } from '@/types';
import { toast } from 'sonner';

const newsSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  summary: z.string().optional(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  originalLink: z.string().url('Link inválido').optional().or(z.literal('')),
  originalSource: z.string().optional(),
  status: z.nativeEnum(NewsStatus),
  tags: z.array(z.string()).optional(),
});

type NewsFormData = z.infer<typeof newsSchema>;

interface NewsFormProps {
  newsId?: string;
}

export const NewsForm: React.FC<NewsFormProps> = ({ newsId }) => {
  const [loading, setLoading] = useState(!!newsId);
  const [saving, setSaving] = useState(false);
  const [news, setNews] = useState<News | null>(null);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      status: NewsStatus.DRAFT,
      tags: [],
    },
  });

  const watchedContent = watch('content');
  const watchedTitle = watch('title');

  useEffect(() => {
    if (newsId) {
      fetchNews();
    }
  }, [newsId]);

  const fetchNews = async () => {
    if (!newsId) return;
    
    try {
      setLoading(true);
      const data = await apiClient.getNewsById(newsId);
      setNews(data);
      reset({
        title: data.title,
        summary: data.summary || '',
        content: data.content,
        originalLink: data.originalLink || '',
        originalSource: data.originalSource || '',
        status: data.status,
        tags: data.tags || [],
      });
      setTagsInput(data.tags?.join(', ') || '');
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Erro ao carregar notícia');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: NewsFormData) => {
    try {
      setSaving(true);
      
      const newsData = {
        ...data,
        tags: data.tags || [],
      };

      if (newsId) {
        await apiClient.updateNews(newsId, newsData as UpdateNewsRequest);
        toast.success('Notícia atualizada com sucesso');
      } else {
        await apiClient.createNews(newsData as CreateNewsRequest);
        toast.success('Notícia criada com sucesso');
      }
      
      router.push('/dashboard/news');
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Erro ao salvar notícia');
    } finally {
      setSaving(false);
    }
  };

  const handleAiProcess = async () => {
    if (!watchedTitle || !watchedContent) {
      toast.error('Título e conteúdo são necessários para processamento com IA');
      return;
    }

    try {
      setAiProcessing(true);
      const result = await apiClient.processNewsContent({
        title: watchedTitle,
        content: watchedContent,
        originalSource: watch('originalSource'),
      });

      // Apply AI suggestions
      if (result.processedTitle) {
        setValue('title', result.processedTitle);
      }
      if (result.summary) {
        setValue('summary', result.summary);
      }
      if (result.tags && result.tags.length > 0) {
        setValue('tags', result.tags);
        setTagsInput(result.tags.join(', '));
      }

      toast.success('Processamento com IA concluído');
    } catch (error) {
      console.error('Error processing with AI:', error);
      toast.error('Erro no processamento com IA');
    } finally {
      setAiProcessing(false);
    }
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setValue('tags', tags);
  };

  const addTag = (tag: string) => {
    const currentTags = watch('tags') || [];
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag];
      setValue('tags', newTags);
      setTagsInput(newTags.join(', '));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo da Notícia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Label htmlFor="summary">Resumo</Label>
                  <Textarea
                    id="summary"
                    {...register('summary')}
                    placeholder="Resumo da notícia (opcional)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo *</Label>
                  <Textarea
                    id="content"
                    {...register('content')}
                    placeholder="Conteúdo completo da notícia"
                    rows={10}
                  />
                  {errors.content && (
                    <p className="text-sm text-red-600">{errors.content.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações Adicionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="originalLink">Link Original</Label>
                  <Input
                    id="originalLink"
                    {...register('originalLink')}
                    placeholder="https://exemplo.com/noticia"
                    type="url"
                  />
                  {errors.originalLink && (
                    <p className="text-sm text-red-600">{errors.originalLink.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalSource">Fonte Original</Label>
                  <Input
                    id="originalSource"
                    {...register('originalSource')}
                    placeholder="Nome da fonte (ex: InfoMoney, G1)"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={watch('status')}
                    onValueChange={(value) => setValue('status', value as NewsStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NewsStatus.DRAFT}>Rascunho</SelectItem>
                      <SelectItem value={NewsStatus.PUBLISHED}>Publicado</SelectItem>
                      <SelectItem value={NewsStatus.ARCHIVED}>Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={tagsInput}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    placeholder="tecnologia, inovação, negócios"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separe as tags por vírgula
                  </p>
                </div>

                {watch('tags') && watch('tags')!.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {watch('tags')!.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ferramentas de IA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAiProcess}
                  disabled={aiProcessing || !watchedTitle || !watchedContent}
                  className="w-full"
                >
                  {aiProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-4 w-4" />
                      Processar com IA
                    </>
                  )}
                </Button>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    A IA irá otimizar o título, gerar resumo e sugerir tags
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <div className="flex space-x-2">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
