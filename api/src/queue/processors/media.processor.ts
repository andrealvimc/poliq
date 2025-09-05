import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { DatabaseService } from '../../database/database.service';
import { MediaService } from '../../media/media.service';

@Processor('media-generation')
export class MediaProcessor {
  private readonly logger = new Logger(MediaProcessor.name);

  constructor(
    private database: DatabaseService,
    private mediaService: MediaService,
  ) {}

  @Process('generate-image')
  async generateImage(job: Job) {
    const { newsId } = job.data;
    this.logger.log(`Generating image for news: ${newsId}`);

    try {
      // Get complete news data from database
      const news = await this.database.news.findUnique({
        where: { id: newsId },
      });

      if (!news) {
        throw new Error(`News with id ${newsId} not found`);
      }

      // Generate image using news data and existing imageUrl as background
      const imageResult = await this.mediaService.generateImage({
        title: news.title,
        subtitle: news.summary || news.aiSummary,
        category: news.tags?.[0], // Use first tag as category
        backgroundImage: news.imageUrl, // Use existing image as background
        template: 'infomoney',
        format: 'png',
      });
      
      const imageUrl = imageResult.success ? imageResult.url : null;

      if (imageUrl) {
        // Update news with generated social media image
        // Keep original imageUrl, save generated image for social media use
        await this.database.news.update({
          where: { id: newsId },
          data: {
            socialImageUrl: imageUrl, // Save the generated social media image
            imageGenerated: true,
          },
        });

        this.logger.log(`Successfully generated image for news: ${newsId}`);
      }

      // Update job status
      await this.database.queueJob.updateMany({
        where: {
          newsId,
          jobType: 'GENERATE_IMAGE',
          status: 'PENDING',
        },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          result: { imageUrl: imageUrl || null },
        },
      });

      return { imageUrl };

    } catch (error) {
      this.logger.error(`Failed to generate image for news: ${newsId}`, error.message);
      
      // Update job status
      await this.database.queueJob.updateMany({
        where: {
          newsId,
          jobType: 'GENERATE_IMAGE',
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
