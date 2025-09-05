import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { HybridNewsService } from '../services/hybrid-news.service';

@Controller('providers/test')
export class RSSTestController {
  constructor(private readonly hybridNewsService: HybridNewsService) {}

  @Post('rss')
  async testRSSFeeds(@Body() body: { category?: string }) {
    try {
      const categories = body.category ? [body.category] : ['politica', 'tecnologia', 'economia'];
      const news = await this.hybridNewsService.fetchNews(categories);
      
      // Filtrar apenas RSS feeds
      const rssNews = news.filter(item => 
        item.source.includes('RSS') || 
        item.source.includes('G1') || 
        item.source.includes('UOL') ||
        item.source.includes('Estadão') ||
        item.source.includes('Folha')
      );

      return {
        message: 'RSS feeds testados com sucesso',
        count: rssNews.length,
        articles: rssNews.map(item => ({
          title: item.title,
          content: item.content,
          contentLength: item.content.length,
          source: item.source,
          category: item.category,
          url: item.url,
          hasFullContent: item.content.length > 200
        }))
      };
    } catch (error) {
      return {
        message: 'Erro ao testar RSS feeds',
        error: error.message,
        count: 0,
        articles: []
      };
    }
  }

  @Post('fetch-and-save-test')
  async testFetchAndSave() {
    try {
      const news = await this.hybridNewsService.fetchNews(['politica']);
      
      return {
        message: 'Teste de fetch concluído',
        count: news.length,
        articles: news.slice(0, 3).map(item => ({
          title: item.title,
          contentLength: item.content?.length || 0,
          source: item.source,
          category: item.category
        }))
      };
    } catch (error) {
      return {
        message: 'Erro no teste',
        error: error.message
      };
    }
  }

  @Get('content-analysis')
  async analyzeContent() {
    try {
      const news = await this.hybridNewsService.fetchNews(['politica']);
      
      const analysis = news.map(item => ({
        title: item.title.substring(0, 50) + '...',
        source: item.source,
        contentLength: item.content.length,
        contentPreview: item.content.substring(0, 100) + '...',
        hasFullContent: item.content.length > 200,
        contentQuality: item.content.length > 500 ? 'Excelente' : 
                       item.content.length > 200 ? 'Bom' : 
                       item.content.length > 100 ? 'Regular' : 'Ruim'
      }));

      const stats = {
        total: news.length,
        withFullContent: news.filter(item => item.content.length > 200).length,
        averageLength: Math.round(news.reduce((sum, item) => sum + item.content.length, 0) / news.length),
        sources: [...new Set(news.map(item => item.source))].map(source => ({
          name: source,
          count: news.filter(item => item.source === source).length,
          avgLength: Math.round(
            news.filter(item => item.source === source)
                .reduce((sum, item) => sum + item.content.length, 0) / 
            news.filter(item => item.source === source).length
          )
        }))
      };

      return {
        message: 'Análise de conteúdo concluída',
        stats,
        analysis
      };
    } catch (error) {
      return {
        message: 'Erro na análise de conteúdo',
        error: error.message
      };
    }
  }
}
