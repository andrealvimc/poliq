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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Image,
  Download,
  Copy,
  Check,
  Loader2,
  Palette,
  Instagram,
  Facebook,
  Twitter,
  Trash2,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

const imageSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  style: z.string().optional(),
  format: z.enum(['png', 'jpeg', 'webp']).optional(),
  template: z.string().optional(),
});

type ImageFormData = z.infer<typeof imageSchema>;

interface GeneratedImage {
  url?: string;
  data?: string;
  filename?: string;
  metadata?: {
    template: string;
    dimensions: {
      width: number;
      height: number;
    };
    format: string;
    size: number;
  };
}

export const MediaWorkspace: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [templates, setTemplates] = useState<string[]>([]);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ImageFormData>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      format: 'png',
    },
  });

  const watchedTitle = watch('title');

  React.useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const result = await apiClient.getAvailableTemplates();
      setTemplates(result.templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

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

  const generateImage = async (data: ImageFormData) => {
    try {
      setLoading(true);
      const result = await apiClient.generateImage(data);
      setGeneratedImages(prev => [result, ...prev]);
      toast.success('Imagem gerada com sucesso');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Erro ao gerar imagem');
    } finally {
      setLoading(false);
    }
  };

  const generateBase64Image = async (data: ImageFormData) => {
    try {
      setLoading(true);
      const result = await apiClient.generateBase64Image(data);
      if (result.success && result.data) {
        setGeneratedImages(prev => [{
          data: result.data,
          url: `data:image/${data.format || 'png'};base64,${result.data}`,
        }, ...prev]);
        toast.success('Imagem gerada com sucesso');
      } else {
        toast.error(result.error || 'Erro ao gerar imagem');
      }
    } catch (error) {
      console.error('Error generating base64 image:', error);
      toast.error('Erro ao gerar imagem');
    } finally {
      setLoading(false);
    }
  };

  const generateSocialImage = async (platform: string, data: ImageFormData) => {
    try {
      setLoading(true);
      const result = await apiClient.generateSocialImage(platform, {
        title: data.title,
        subtitle: data.description,
        category: data.style,
      });
      setGeneratedImages(prev => [result, ...prev]);
      toast.success(`Imagem para ${platform} gerada com sucesso`);
    } catch (error) {
      console.error('Error generating social image:', error);
      toast.error('Erro ao gerar imagem para rede social');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (image: GeneratedImage) => {
    if (image.url) {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = image.filename || 'generated-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const deleteImage = async (index: number) => {
    const image = generatedImages[index];
    if (image.url && !image.url.startsWith('data:')) {
      try {
        await apiClient.deleteImage(image.url);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    setGeneratedImages(prev => prev.filter((_, i) => i !== index));
    toast.success('Imagem removida');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Gerar Imagem</TabsTrigger>
          <TabsTrigger value="gallery">Galeria</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Configurações da Imagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      {...register('title')}
                      placeholder="Título da imagem"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="Descrição adicional (opcional)"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="style">Estilo</Label>
                    <Select onValueChange={(value) => setValue('style', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um estilo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="news">Notícias</SelectItem>
                        <SelectItem value="modern">Moderno</SelectItem>
                        <SelectItem value="classic">Clássico</SelectItem>
                        <SelectItem value="minimal">Minimalista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="format">Formato</Label>
                    <Select
                      value={watch('format')}
                      onValueChange={(value) => setValue('format', value as 'png' | 'jpeg' | 'webp')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {templates.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="template">Template</Label>
                      <Select onValueChange={(value) => setValue('template', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((template) => (
                            <SelectItem key={template} value={template}>
                              {template}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleSubmit(generateImage)}
                  disabled={loading || !watchedTitle}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Image className="mr-2 h-4 w-4" />
                      Gerar Imagem
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleSubmit(generateBase64Image)}
                  disabled={loading || !watchedTitle}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Image className="mr-2 h-4 w-4" />
                      Gerar Base64
                    </>
                  )}
                </Button>

                <div className="space-y-2">
                  <Label>Redes Sociais</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => handleSubmit((data) => generateSocialImage('instagram', data))()}
                      disabled={loading || !watchedTitle}
                      variant="outline"
                      size="sm"
                    >
                      <Instagram className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleSubmit((data) => generateSocialImage('facebook', data))()}
                      disabled={loading || !watchedTitle}
                      variant="outline"
                      size="sm"
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleSubmit((data) => generateSocialImage('twitter', data))()}
                      disabled={loading || !watchedTitle}
                      variant="outline"
                      size="sm"
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {loading && (
                  <Alert>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertDescription>
                      Gerando imagem... Aguarde um momento.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          {generatedImages.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Nenhuma imagem gerada ainda. Use as ferramentas para criar imagens.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {generatedImages.map((image, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {image.url && (
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image.url}
                            alt="Generated"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {image.metadata && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Dimensões:</span>
                            <span>
                              {image.metadata.dimensions.width}x{image.metadata.dimensions.height}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Formato:</span>
                            <Badge variant="outline">{image.metadata.format}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Tamanho:</span>
                            <span>{(image.metadata.size / 1024).toFixed(1)} KB</span>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadImage(image)}
                          className="flex-1"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        {image.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(image.url!, `image-${index}`)}
                          >
                            {copiedItem === `image-${index}` ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteImage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
