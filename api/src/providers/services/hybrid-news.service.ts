import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as Parser from 'rss-parser';

import { NewsProviderResult } from '../interfaces/news-provider.interface';
import { ContentProcessorService } from '../../ai/services/content-processor.service';

@Injectable()
export class HybridNewsService {
  private readonly logger = new Logger(HybridNewsService.name);
  private readonly parser = new Parser();
  
  // Configurações das APIs
  private readonly newsApiKey: string;
  private readonly redditApiKey: string;
  private readonly twitterApiKey: string;

  // Fontes RSS brasileiras organizadas por categoria
  private readonly rssSources = {
    politica: [
      {
        name: 'G1 Política',
        url: 'https://g1.globo.com/rss/g1/politica/',
        category: 'politica'
      },
      {
        name: 'UOL Política',
        url: 'https://noticias.uol.com.br/politica/feed.xml',
        category: 'politica'
      },
      {
        name: 'Estadão Política',
        url: 'https://www.estadao.com.br/rss/politica.xml',
        category: 'politica'
      },
      {
        name: 'Folha Política',
        url: 'https://www1.folha.uol.com.br/poder/rss091.xml',
        category: 'politica'
      },
      
    ],
    economia: [
      {
        name: 'G1 Economia',
        url: 'https://g1.globo.com/rss/g1/economia/',
        category: 'economia'
      },
      {
        name: 'UOL Economia',
        url: 'https://economia.uol.com.br/feed.xml',
        category: 'economia'
      },
      {
        name: 'Estadão Economia',
        url: 'https://www.estadao.com.br/rss/economia.xml',
        category: 'economia'
      },
      {
        name: 'Folha Mercado',
        url: 'https://www1.folha.uol.com.br/mercado/rss091.xml',
        category: 'economia'
      },
      {
        name: 'InfoMoney',
        url: 'https://www.infomoney.com.br/feed/',
        category: 'economia'
      },
      {
        name: 'Valor Econômico',
        url: 'https://valor.globo.com/rss.xml',
        category: 'economia'
      },
      {
        name: 'Exame',
        url: 'https://exame.com/feed/',
        category: 'economia'
      }
    ],
    tecnologia: [
      {
        name: 'G1 Tecnologia',
        url: 'https://g1.globo.com/rss/g1/tecnologia/',
        category: 'tecnologia'
      },
      {
        name: 'UOL Tecnologia',
        url: 'https://tecnologia.uol.com.br/feed.xml',
        category: 'tecnologia'
      },
      {
        name: 'Estadão Tecnologia',
        url: 'https://www.estadao.com.br/rss/tecnologia.xml',
        category: 'tecnologia'
      },
      {
        name: 'Folha Tecnologia',
        url: 'https://www1.folha.uol.com.br/tec/rss091.xml',
        category: 'tecnologia'
      },
      {
        name: 'TecMundo',
        url: 'https://www.tecmundo.com.br/feed',
        category: 'tecnologia'
      },
      {
        name: 'Canaltech',
        url: 'https://canaltech.com.br/feed/',
        category: 'tecnologia'
      },
      {
        name: 'Olhar Digital',
        url: 'https://olhardigital.com.br/feed/',
        category: 'tecnologia'
      }
    ],
    geral: [
      {
        name: 'UOL Notícias',
        url: 'https://www.uol.com.br/feeds/noticias.xml',
        category: 'geral'
      },
      {
        name: 'Estadão Geral',
        url: 'https://www.estadao.com.br/rss/',
        category: 'geral'
      },
      {
        name: 'Folha Geral',
        url: 'https://www1.folha.uol.com.br/folha/principal/folha.xml',
        category: 'geral'
      }
    ]
  };

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private contentProcessor: ContentProcessorService,
  ) {
    this.newsApiKey = this.configService.get('externalApis.newsApi.apiKey');
    this.redditApiKey = this.configService.get('externalApis.reddit.apiKey');
    this.twitterApiKey = this.configService.get('externalApis.twitter.apiKey');
    
    // Configurar parser para pegar mais conteúdo
    this.parser = new Parser({
      customFields: {
        item: ['content:encoded', 'description', 'summary', 'media:description', 'media:content', 'enclosure']
      },
      timeout: 15000, // 15 segundos timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Poliq-News-Bot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
        'Accept-Charset': 'utf-8',
        'Accept-Encoding': 'gzip, deflate'
      }
    });
  }

  async fetchNews(categories?: string[]): Promise<NewsProviderResult[]> {
    const allNews: NewsProviderResult[] = [];

    try {
      // Usar apenas RSS feeds (GNews desativado)
      this.logger.log('Using RSS-only mode (GNews disabled)');
      
      const rssResults = await this.fetchFromRSS(categories);
      allNews.push(...rssResults);

      // Remover duplicatas e ordenar por data
      const uniqueNews = this.removeDuplicates(allNews);
      const sortedNews = uniqueNews.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      this.logger.log(`Fetched ${sortedNews.length} news from RSS sources`);
      return sortedNews;

    } catch (error) {
      this.logger.error('Error fetching news from RSS sources:', error);
      throw error;
    }
  }

  private async fetchFromNewsAPI(categories?: string[]): Promise<NewsProviderResult[]> {
    try {
      const query = this.buildCategoryQuery(categories || ['politica', 'tecnologia', 'economia']);
      
      const params = new URLSearchParams({
        q: query,
        language: 'pt',
        country: 'br',
        sortBy: 'publishedAt',
        pageSize: '20',
        apiKey: this.newsApiKey,
      });

      const url = `https://newsapi.org/v2/everything?${params.toString()}`;
      
      const response = await firstValueFrom(
        this.httpService.get(url)
      );

      return response.data.articles.map(article => ({
        title: article.title,
        content: article.description || article.content,
        url: article.url,
        publishedAt: new Date(article.publishedAt),
        source: article.source.name,
        category: this.categorizeContent(article.title + ' ' + article.description),
        imageUrl: article.urlToImage,
        author: article.author
      }));

    } catch (error) {
      this.logger.warn('NewsAPI failed:', error.message);
      return [];
    }
  }

  private async fetchFromRSS(categories?: string[]): Promise<NewsProviderResult[]> {
    const results: NewsProviderResult[] = [];
    
    // Se não especificar categorias, buscar todas
    const targetCategories = categories || ['politica', 'tecnologia', 'economia'];
    
    this.logger.log(`Fetching RSS feeds for categories: ${targetCategories.join(', ')}`);

    for (const category of targetCategories) {
      const sources = this.rssSources[category] || [];
      
      for (const source of sources) {
        try {
          this.logger.log(`Fetching from ${source.name} (${category})`);
          
          const feed = await this.parser.parseURL(source.url);
          
          const news = feed.items.slice(0, 8).map(item => {
            // Extrair conteúdo com fallback inteligente
            const content = this.extractContent(item);
            
            return {
              title: item.title || '',
              content: content,
              url: item.link || '',
              publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
              source: source.name,
              category: source.category,
              imageUrl: item.enclosure?.url || this.extractImageUrl(item),
              author: item.creator || item.author || null
            };
          });

          results.push(...news);
          this.logger.log(`Fetched ${news.length} items from ${source.name}`);

        } catch (error) {
          this.logger.warn(`RSS source ${source.name} failed:`, error.message);
        }
      }
    }

    this.logger.log(`Total RSS items fetched: ${results.length}`);
    return results;
  }

  private async fetchFromReddit(categories?: string[]): Promise<NewsProviderResult[]> {
    try {
      const subreddits = ['brasil', 'investimentos', 'tecnologia'];
      const results: NewsProviderResult[] = [];

      for (const subreddit of subreddits) {
        const url = `https://www.reddit.com/r/${subreddit}.json?limit=10`;
        
        const response = await firstValueFrom(
          this.httpService.get(url)
        );

        const posts = response.data.data.children.map(child => ({
          title: child.data.title,
          content: child.data.selftext || '',
          url: `https://reddit.com${child.data.permalink}`,
          publishedAt: new Date(child.data.created_utc * 1000),
          source: `Reddit r/${subreddit}`,
          category: this.categorizeContent(child.data.title + ' ' + child.data.selftext),
          imageUrl: child.data.thumbnail !== 'self' ? child.data.thumbnail : null,
          author: child.data.author
        }));

        results.push(...posts);
      }

      return results;

    } catch (error) {
      this.logger.warn('Reddit API failed:', error.message);
      return [];
    }
  }

  private async fetchFromTwitter(categories?: string[]): Promise<NewsProviderResult[]> {
    // Implementação do Twitter API v2
    // Por enquanto, retorna array vazio
    return [];
  }

  private buildCategoryQuery(categories: string[]): string {
    const categoryMap = {
      politica: ['política', 'governo', 'presidente', 'eleição', 'congresso'],
      tecnologia: ['tecnologia', 'tech', 'digital', 'AI', 'startup', 'inovação'],
      economia: ['economia', 'business', 'mercado', 'bolsa', 'dólar', 'empresa']
    };

    const queries = categories.map(cat => 
      categoryMap[cat]?.join(' OR ') || cat
    );

    return queries.join(' OR ');
  }

  private categorizeContent(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('política') || lowerContent.includes('governo') || 
        lowerContent.includes('presidente') || lowerContent.includes('eleição')) {
      return 'politica';
    }
    
    if (lowerContent.includes('tecnologia') || lowerContent.includes('tech') || 
        lowerContent.includes('digital') || lowerContent.includes('AI')) {
      return 'tecnologia';
    }
    
    if (lowerContent.includes('economia') || lowerContent.includes('business') || 
        lowerContent.includes('mercado') || lowerContent.includes('bolsa')) {
      return 'economia';
    }
    
    return 'geral';
  }

  private removeDuplicates(news: NewsProviderResult[]): NewsProviderResult[] {
    const seen = new Set();
    return news.filter(item => {
      const key = `${item.title}-${item.source}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private extractContent(item: any): string {
    // Prioridade: content:encoded > content > contentSnippet > description > summary
    let content = 
      item['content:encoded'] || 
      item.content || 
      item.contentSnippet || 
      item.description || 
      item.summary || 
      '';

    // Corrigir encoding UTF-8
    if (content) {
      try {
        // Tentar corrigir caracteres mal codificados
        content = content
          .replace(/tne/g, 'tône')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
      } catch (error) {
        this.logger.warn('Error fixing encoding:', error.message);
      }
    }

    // Limpar HTML e tags desnecessárias
    return this.cleanContent(content);
  }

  private extractImageUrl(item: any): string | null {
    // Tentar extrair imagem de diferentes campos RSS
    if (item.enclosure?.url && this.isImageUrl(item.enclosure.url)) {
      return item.enclosure.url;
    }
    if (item['media:content']?.url && this.isImageUrl(item['media:content'].url)) {
      return item['media:content'].url;
    }
    if (item['media:thumbnail']?.url && this.isImageUrl(item['media:thumbnail'].url)) {
      return item['media:thumbnail'].url;
    }
    
    // Extrair de HTML se disponível
    const content = item.content || item.description || item['content:encoded'] || '';
    if (content) {
      // Buscar todas as imagens no conteúdo
      const imgMatches = content.match(/<img[^>]+src="([^"]+)"/gi);
      if (imgMatches) {
        for (const match of imgMatches) {
          const srcMatch = match.match(/src="([^"]+)"/i);
          if (srcMatch && this.isImageUrl(srcMatch[1])) {
            return srcMatch[1];
          }
        }
      }
      
      // Buscar por padrões específicos do Exame e Folha
      const exameMatch = content.match(/https:\/\/[^"]*\.(jpg|jpeg|png|webp)/i);
      if (exameMatch) return exameMatch[0];
    }
    
    return null;
  }

  private isImageUrl(url: string): boolean {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  }

  private cleanContent(content: string): string {
    if (!content) return '';
    
    // Remove HTML tags but preserve paragraph structure
    let cleaned = content
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<p[^>]*>/gi, '')
      .replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    cleaned = cleaned
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'");
    
    // Remove GNews sharing buttons and social media elements
    cleaned = cleaned.replace(/^(Share\s*\n?Tweet\s*\n?Share\s*\n?Share\s*\n?E-mail\s*\n?)/gi, '');
    cleaned = cleaned.replace(/^(Compartilhar\s*\n?Tweetar\s*\n?Compartilhar\s*\n?Compartilhar\s*\n?E-mail\s*\n?)/gi, '');
    
    // Remove individual sharing terms
    cleaned = cleaned.replace(/\b(Share|Tweet|E-mail|Compartilhar|Tweetar)\b/gi, '');
    
    // Remove common truncation patterns
    cleaned = cleaned.replace(/\.\.\.\s*\[\d+\s*chars\]/gi, '');
    cleaned = cleaned.replace(/\.\.\.\s*\[truncated\]/gi, '');
    cleaned = cleaned.replace(/\.\.\.\s*\[more\]/gi, '');
    cleaned = cleaned.replace(/\.\.\.\s*\[leia mais\]/gi, '');
    cleaned = cleaned.replace(/\.\.\.\s*\[read more\]/gi, '');
    
    // Remove app download prompts
    cleaned = cleaned.replace(/📱Baixe o app do g1 para ver notícias em tempo real e de graça/gi, '');
    cleaned = cleaned.replace(/📱Download the g1 app to see real-time news for free/gi, '');
    cleaned = cleaned.replace(/Baixe o app do g1/gi, '');
    cleaned = cleaned.replace(/Download the g1 app/gi, '');
    
    // Remove photo credits and captions that are not part of the main content
    cleaned = cleaned.replace(/^[A-Z\s\/]+$/gm, ''); // Remove lines with only uppercase letters and slashes (photo credits)
    cleaned = cleaned.replace(/^[A-Z][A-Z\s]+$/gm, ''); // Remove lines with only uppercase words (captions)
    
    // Remove multiple consecutive periods
    cleaned = cleaned.replace(/\.{3,}/g, '...');
    
    // Clean up whitespace and line breaks
    cleaned = cleaned
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple line breaks to double
      .replace(/[ \t]+/g, ' ') // Multiple spaces to single
      .replace(/^\s+|\s+$/gm, '') // Trim each line
      .trim();
    
    // Remove any remaining sharing patterns at the start
    cleaned = cleaned.replace(/^(Share|Tweet|E-mail|Compartilhar|Tweetar)\s*/gi, '');
    
    // If content is too short after cleaning, it might be just metadata
    if (cleaned.length < 50) {
      this.logger.warn(`Content too short after cleaning (${cleaned.length} chars): ${cleaned.substring(0, 30)}...`);
    }
    
    return cleaned.trim();
  }
}
