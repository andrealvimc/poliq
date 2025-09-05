import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { DatabaseService } from '../../database/database.service';
import { PublicationService } from '../../publication/publication.service';

@Processor('social-publication')
export class PublicationProcessor {
  private readonly logger = new Logger(PublicationProcessor.name);

  constructor(
    private database: DatabaseService,
    private publicationService: PublicationService,
  ) {}

  @Process('publish-to-social')
  async publishToSocial(job: Job) {
    const { newsId, platform } = job.data;
    this.logger.log(`Publishing news ${newsId} to ${platform}`);

    try {
      // Get news from database
      const news = await this.database.news.findUnique({
        where: { id: newsId },
      });

      if (!news) {
        throw new Error(`News not found: ${newsId}`);
      }

      // Publish to platform
      const result = await this.publicationService.publishToSocialMedia(
        newsId,
        platform,
      );

      // Update job status
      await this.database.queueJob.updateMany({
        where: {
          newsId,
          jobType: 'PUBLISH_TO_SOCIAL',
          status: 'PENDING',
        },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          result: result,
        },
      });

      this.logger.log(`Successfully published news ${newsId} to ${platform}`);
      return result;

    } catch (error) {
      this.logger.error(`Failed to publish news ${newsId} to ${platform}`, error.message);
      
      // Update job status
      await this.database.queueJob.updateMany({
        where: {
          newsId,
          jobType: 'PUBLISH_TO_SOCIAL',
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
