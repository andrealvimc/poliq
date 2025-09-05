import { Injectable, Logger } from '@nestjs/common';

import { DatabaseService } from '../../database/database.service';
import { ProvidersService } from '../../providers/providers.service';
import { HybridNewsService } from '../../providers/services/hybrid-news.service';
import { QueueService } from '../../queue/queue.service';
import { NewsService } from '../../news/news.service';

@Injectable()
export class NewsSchedulerService {
  private readonly logger = new Logger(NewsSchedulerService.name);

  constructor(
    private database: DatabaseService,
    private providersService: ProvidersService,
    private hybridNewsService: HybridNewsService,
    private queueService: QueueService,
    private newsService: NewsService,
  ) {}

  async fetchAndProcessNews() {
    this.logger.log('Fetching news from external sources');
    
    try {
      // Fetch news from all active sources using hybrid service
      const articles = await this.hybridNewsService.fetchNews();
      
      if (articles.length === 0) {
        this.logger.log('No new articles found');
        return;
      }

      let processedCount = 0;
      
      for (const article of articles) {
        try {
          // Check if article already exists
          const existingNews = await this.database.news.findFirst({
            where: {
              OR: [
                { originalLink: article.url },
                { title: article.title },
              ],
            },
          });

          if (existingNews) {
            this.logger.debug(`Article already exists: ${article.title}`);
            continue;
          }

          // Create news entry
          const news = await this.newsService.create({
            title: article.title,
            summary: article.description || article.content?.substring(0, 200) || '',
            content: article.content || '',
            originalLink: article.url,
            originalSource: article.source,
            imageUrl: article.imageUrl,
            tags: article.tags || [],
            status: 'DRAFT',
          });

          // Add to processing queue FIRST (AI processing)
          await this.queueService.addNewsProcessingJob(news.id, 1);
          
          // NOTE: Media generation will be triggered AFTER AI processing completes
          // This is handled in the news.processor.ts after successful AI processing

          processedCount++;
          
        } catch (error) {
          this.logger.error(`Failed to process article: ${article.title}`, error.message);
        }
      }

      this.logger.log(`Successfully processed ${processedCount} new articles`);
      
    } catch (error) {
      this.logger.error('Failed to fetch and process news:', error.message);
      throw error;
    }
  }

  async processUnprocessedNews() {
    this.logger.log('Processing unprocessed news');
    
    try {
      // Find news that haven't been processed by AI OR failed processing (null fields)
      const unprocessedNews = await this.database.news.findMany({
        where: {
          OR: [
            { aiProcessed: false },
            { 
              AND: [
                { aiProcessed: true },
                { aiSummary: null },
              ]
            }
          ],
          status: { not: 'ARCHIVED' },
        },
        take: 10, // Process in batches
        orderBy: { createdAt: 'asc' },
      });

      if (unprocessedNews.length === 0) {
        this.logger.log('No unprocessed news found');
        return;
      }

      for (const news of unprocessedNews) {
        // Add to processing queue
        await this.queueService.addNewsProcessingJob(news.id, 2);
        
        // DISABLED: Media generation disabled to save local resources
        // if (!news.imageUrl) {
        //   await this.queueService.addMediaGenerationJob(news.id, news.title, 2);
        // }
      }

      this.logger.log(`Added ${unprocessedNews.length} news items to processing queue`);
      
    } catch (error) {
      this.logger.error('Failed to process unprocessed news:', error.message);
      throw error;
    }
  }

  async generateDailyReport() {
    this.logger.log('Generating daily report');
    
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get statistics for yesterday
      const stats = await Promise.all([
        this.database.news.count({
          where: {
            createdAt: {
              gte: yesterday,
              lt: today,
            },
          },
        }),
        this.database.news.count({
          where: {
            publishedAt: {
              gte: yesterday,
              lt: today,
            },
          },
        }),
        this.database.publication.count({
          where: {
            publishedAt: {
              gte: yesterday,
              lt: today,
            },
          },
        }),
        this.database.queueJob.count({
          where: {
            completedAt: {
              gte: yesterday,
              lt: today,
            },
            status: 'COMPLETED',
          },
        }),
      ]);

      const report = {
        date: yesterday.toISOString().split('T')[0],
        newsCreated: stats[0],
        newsPublished: stats[1],
        socialPublications: stats[2],
        jobsCompleted: stats[3],
        generatedAt: new Date(),
      };

      this.logger.log('Daily report:', report);
      
      // You could save this report to database or send via email/notification
      
    } catch (error) {
      this.logger.error('Failed to generate daily report:', error.message);
      throw error;
    }
  }

  async cleanupOldJobs() {
    this.logger.log('Cleaning up old queue jobs');
    
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const deletedJobs = await this.database.queueJob.deleteMany({
        where: {
          completedAt: {
            lt: oneWeekAgo,
          },
          status: {
            in: ['COMPLETED', 'FAILED', 'CANCELLED'],
          },
        },
      });

      this.logger.log(`Cleaned up ${deletedJobs.count} old queue jobs`);
      
    } catch (error) {
      this.logger.error('Failed to cleanup old jobs:', error.message);
      throw error;
    }
  }
}
