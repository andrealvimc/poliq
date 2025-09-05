import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { DatabaseService } from '../../database/database.service';
import { AiService } from '../../ai/ai.service';
import { QueueService } from '../queue.service';

@Processor('news-processing')
export class NewsProcessor {
  private readonly logger = new Logger(NewsProcessor.name);

  constructor(
    private database: DatabaseService,
    private aiService: AiService,
    private queueService: QueueService,
  ) {}

  @Process('process-news')
  async processNews(job: Job) {
    const { newsId } = job.data;
    this.logger.log(`Processing news: ${newsId}`);

    try {
      // Get news from database
      const news = await this.database.news.findUnique({
        where: { id: newsId },
      });

      if (!news) {
        throw new Error(`News not found: ${newsId}`);
      }

      // Process with AI
      const result = await this.aiService.processNewsContent(
        news.title,
        news.content,
        news.originalSource,
      );

      // Update news with AI results
      await this.database.news.update({
        where: { id: newsId },
        data: {
          aiSummary: result.summary,
          aiHeadline: result.headline,
          aiCommentary: result.commentary,
          aiContent: result.content,
          aiProcessed: result.processed,
        },
      });

      // Update job status
      await this.database.queueJob.updateMany({
        where: {
          newsId,
          jobType: 'PROCESS_CONTENT',
          status: 'PENDING',
        },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          result: JSON.parse(JSON.stringify(result)),
        },
      });

      // 🎯 DISABLED: Media generation disabled to save local resources
      // if (result.processed && result.headline) {
      //   this.logger.log(`Triggering media generation for news: ${newsId} with AI title: ${result.headline}`);
      //   await this.queueService.addMediaGenerationJob(newsId, result.headline, 2);
      // } else {
      //   // Fallback to original title if AI processing failed
      //   this.logger.log(`Triggering media generation for news: ${newsId} with original title (AI failed)`);
      //   await this.queueService.addMediaGenerationJob(newsId, news.title, 2);
      // }

      this.logger.log(`Successfully processed news: ${newsId}`);
      return result;

    } catch (error) {
      this.logger.error(`Failed to process news: ${newsId}`, error.message);
      
      // Update job status
      await this.database.queueJob.updateMany({
        where: {
          newsId,
          jobType: 'PROCESS_CONTENT',
          status: 'PENDING',
        },
        data: {
          status: 'FAILED',
          error: error.message,
          completedAt: new Date(),
        },
      });

      throw error;
    }
  }
}
