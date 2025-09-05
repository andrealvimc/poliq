import { Injectable, Logger } from '@nestjs/common';

import { GnewsService } from './services/gnews.service';
import { ExternalSourceService } from './services/external-source.service';
import { NewsProviderResult } from './interfaces/news-provider.interface';

@Injectable()
export class ProvidersService {
  private readonly logger = new Logger(ProvidersService.name);

  constructor(
    private gnewsService: GnewsService,
    private externalSourceService: ExternalSourceService,
  ) {}

  async fetchNewsFromAllSources(): Promise<NewsProviderResult[]> {
    this.logger.log('Fetching news from all active sources');
    
    const results: NewsProviderResult[] = [];
    
    try {
      // Get active sources
      const activeSources = await this.externalSourceService.findActive();
      
      for (const source of activeSources) {
        try {
          let sourceResults: NewsProviderResult[] = [];
          
          switch (source.type) {
            case 'NEWS_API':
              if (source.name === 'GNews') {
                sourceResults = await this.gnewsService.fetchNews();
              }
              break;
            // Add more provider types here
            default:
              this.logger.warn(`Unknown source type: ${source.type}`);
          }
          
          // Update last fetch time
          await this.externalSourceService.updateLastFetch(source.id);
          
          results.push(...sourceResults);
          this.logger.log(`Fetched ${sourceResults.length} articles from ${source.name}`);
          
        } catch (error) {
          this.logger.error(`Failed to fetch from ${source.name}:`, error.message);
        }
      }
      
    } catch (error) {
      this.logger.error('Failed to fetch news from sources:', error.message);
    }
    
    this.logger.log(`Total articles fetched: ${results.length}`);
    return results;
  }

  async fetchNewsFromSource(sourceId: string): Promise<NewsProviderResult[]> {
    const source = await this.externalSourceService.findById(sourceId);
    
    if (!source || !source.isActive) {
      throw new Error('Source not found or inactive');
    }

    switch (source.type) {
      case 'NEWS_API':
        if (source.name === 'GNews') {
          return await this.gnewsService.fetchNews();
        }
        break;
      // Add more provider types here
      default:
        throw new Error(`Unsupported source type: ${source.type}`);
    }

    return [];
  }
}
