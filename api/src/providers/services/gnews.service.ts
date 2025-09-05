import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { NewsProviderResult } from '../interfaces/news-provider.interface';
import { ContentProcessorService } from '../../ai/services/content-processor.service';

@Injectable()
export class GnewsService {
  private readonly logger = new Logger(GnewsService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly config: any;

  // Categorias de pesquisa simplificadas (máximo 200 chars na GNews)
  private readonly searchCategories = {
    politica: ['política', 'governo', 'presidente', 'eleição', 'congresso'],
    tecnologia: ['tecnologia', 'tech', 'digital', 'AI', 'startup', 'inovação'],
    economia: ['economia', 'business', 'mercado', 'bolsa', 'dólar', 'empresa']
  };

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private contentProcessor: ContentProcessorService,
  ) {
    this.apiKey = this.configService.get('externalApis.gnews.apiKey');
    this.baseUrl = this.configService.get('externalApis.gnews.baseUrl');
    this.config = this.configService.get('externalApis.gnews');
  }

  async fetchNews(categories?: string[]): Promise<NewsProviderResult[]> {
   
    if (!this.apiKey) {
      this.logger.warn('GNews API key not configured');
      return [];
    }

    try {
      // Usar categorias específicas ou buscar todas as 3 principais
      const searchCategories = categories || ['politica', 'tecnologia', 'economia'];
      const query = this.buildCategoryQuery(searchCategories);

      // Build URL with all parameters as query string
      const params = new URLSearchParams({
        apikey: this.apiKey,
        q: query,
        lang: 'pt',
        country: 'br',
        max: String(this.config.max || 10),
        sortby: 'publishedAt',
      });

      const url = `${this.baseUrl}/search?${params.toString()}`;
      
      this.logger.log(`Fetching news from GNews API: ${url.replace(this.apiKey, 'API_KEY_HIDDEN')}`);
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Poliq-News-Bot/1.0'
          }
        })
      );

      this.logger.debug(`GNews API Response Status: ${response.status}`);
      this.logger.debug(`GNews API Response Data: ${JSON.stringify(response.data, null, 2)}`);

      if (!response.data) {
        this.logger.warn('Empty response data from GNews API');
        return [];
      }

      if (!response.data.articles) {
        this.logger.warn('No articles field in GNews response:', response.data);
        return [];
      }

      if (response.data.articles.length === 0) {
        this.logger.warn(`GNews returned 0 articles. Total available: ${response.data.totalArticles || 'unknown'}`);
        return [];
      }

      const articles = await Promise.all(
        response.data.articles.map(async (article: any): Promise<NewsProviderResult> => {
          const cleanedContent = await this.contentProcessor.cleanContent(article.content || '');
          const cleanedDescription = await this.contentProcessor.cleanContent(article.description || '');
          
          return {
            title: article.title,
            description: cleanedDescription,
            content: cleanedContent,
            url: article.url,
            source: article.source?.name || 'GNews',
            publishedAt: new Date(article.publishedAt),
            imageUrl: article.image,
            author: article.source?.name,
            tags: this.extractTags(article.title, cleanedDescription),
          };
        })
      );

      this.logger.log(`Successfully fetched ${articles.length} articles from GNews (total available: ${response.data.totalArticles || 'unknown'})`);
      return articles;

    } catch (error) {
      this.logger.error('Failed to fetch news from GNews:', error.message);
      if (error.response) {
        this.logger.error(`GNews API Error Status: ${error.response.status}`);
        this.logger.error(`GNews API Error Data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
      return [];
    }
  }

  private extractTags(title: string, description?: string): string[] {
    // Simple tag extraction - you can improve this with NLP
    const text = `${title} ${description || ''}`.toLowerCase();
    const tags: string[] = [];

    // Common news categories/tags
    const tagMap = {
      'tecnologia': ['technology', 'tech'],
      'política': ['politics', 'governo'],
      'economia': ['economy', 'business', 'mercado'],
      'esporte': ['sports', 'futebol'],
      'saúde': ['health', 'medicina'],
      'educação': ['education', 'ensino'],
      'meio ambiente': ['environment', 'sustentabilidade'],
    };

    Object.entries(tagMap).forEach(([tag, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        tags.push(tag);
      }
    });

    return tags;
  }

  /**
   * Buscar notícias por categoria específica
   */
  async fetchNewsByCategory(category: string): Promise<NewsProviderResult[]> {
    if (!this.searchCategories[category]) {
      this.logger.warn(`Category not found: ${category}`);
      return [];
    }

    return this.fetchNews([category]);
  }

  /**
   * Buscar notícias de múltiplas categorias
   */
  async fetchNewsByCategories(categories: string[]): Promise<NewsProviderResult[]> {
    const validCategories = categories.filter(cat => this.searchCategories[cat]);
    
    if (validCategories.length === 0) {
      this.logger.warn('No valid categories provided');
      return [];
    }

    return this.fetchNews(validCategories);
  }

  /**
   * Construir query de busca baseada nas categorias
   */
  private buildCategoryQuery(categories: string[]): string {
    const queries = categories.map(category => {
      const keywords = this.searchCategories[category];
      if (!keywords) return '';
      
      // Criar query para a categoria: (keyword1 OR keyword2 OR keyword3)
      return `(${keywords.join(' OR ')})`;
    }).filter(q => q.length > 0);

    // Combinar todas as categorias: (cat1) OR (cat2) OR (cat3)
    const finalQuery = queries.join(' OR ');
    
    this.logger.debug(`Built query for categories [${categories.join(', ')}]: ${finalQuery}`);
    return finalQuery;
  }

  /**
   * Obter todas as categorias disponíveis
   */
  getAvailableCategories(): string[] {
    return Object.keys(this.searchCategories);
  }

  /**
   * Obter palavras-chave de uma categoria
   */
  getCategoryKeywords(category: string): string[] {
    return this.searchCategories[category] || [];
  }
}

