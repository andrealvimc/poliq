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

  @Post('newsapi')
  async testNewsAPI(@Body() body: { category?: string }) {
    try {
      const categories = body.category ? [body.category] : ['politica', 'tecnologia', 'economia'];
      const news = await this.hybridNewsService.fetchNews(categories);
      
      // Filtrar apenas NewsAPI
      const newsApiNews = news.filter(item => 
        !item.source.includes('RSS') && 
        !item.source.includes('G1') && 
        !item.source.includes('UOL') &&
        !item.source.includes('Estadão') &&
        !item.source.includes('Folha')
      );

      return {
        message: 'NewsAPI testado com sucesso',
        count: newsApiNews.length,
        articles: newsApiNews.map(item => ({
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
        message: 'Erro ao testar NewsAPI',
        error: error.message,
        count: 0,
        articles: []
      };
    }
  }

  @Get('newsapi-status')
  async testNewsAPIStatus() {
    try {
      // Verificar se a chave está configurada
      const configService = this.hybridNewsService['configService'];
      const newsApiKey = configService.get('externalApis.newsApi.apiKey');
      
      return {
        message: 'Status do NewsAPI',
        configured: !!(newsApiKey && newsApiKey !== 'undefined' && newsApiKey.trim() !== ''),
        hasKey: !!newsApiKey,
        keyLength: newsApiKey ? newsApiKey.length : 0,
        keyPreview: newsApiKey ? `${newsApiKey.substring(0, 8)}...` : 'N/A'
      };
    } catch (error) {
      return {
        message: 'Erro ao verificar status do NewsAPI',
        error: error.message,
        configured: false
      };
    }
  }

  @Post('all')
  async testAllSources(@Body() body: { category?: string }) {
    try {
      const categories = body.category ? [body.category] : ['politica', 'tecnologia', 'economia'];
      const news = await this.hybridNewsService.fetchNews(categories);

      // Separar por fonte
      const rssNews = news.filter(item => 
        item.source.includes('RSS') || 
        item.source.includes('G1') || 
        item.source.includes('UOL') ||
        item.source.includes('Estadão') ||
        item.source.includes('Folha')
      );

      const newsApiNews = news.filter(item => 
        !item.source.includes('RSS') && 
        !item.source.includes('G1') && 
        !item.source.includes('UOL') &&
        !item.source.includes('Estadão') &&
        !item.source.includes('Folha')
      );

      return {
        message: 'Todas as fontes testadas com sucesso',
        total: news.length,
        rss: {
          count: rssNews.length,
          articles: rssNews.map(item => ({
            title: item.title,
            source: item.source,
            category: item.category,
            url: item.url
          }))
        },
        newsapi: {
          count: newsApiNews.length,
          articles: newsApiNews.map(item => ({
            title: item.title,
            source: item.source,
            category: item.category,
            url: item.url
          }))
        }
      };
    } catch (error) {
      return {
        message: 'Erro ao testar todas as fontes',
        error: error.message,
        total: 0,
        rss: { count: 0, articles: [] },
        newsapi: { count: 0, articles: [] }
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
