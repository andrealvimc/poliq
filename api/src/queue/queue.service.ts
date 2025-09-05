import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue('news-processing') private newsQueue: Queue,
    @InjectQueue('media-generation') private mediaQueue: Queue,
    @InjectQueue('social-publication') private publicationQueue: Queue,
    private database: DatabaseService,
  ) {}

  async addNewsProcessingJob(newsId: string, priority: number = 0) {
    this.logger.log(`Adding news processing job for news: ${newsId}`);
    
    const job = await this.newsQueue.add(
      'process-news',
      { newsId },
      {
        priority,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      }
    );

    // Save job to database
    await this.database.queueJob.create({
      data: {
        newsId,
        jobType: 'PROCESS_CONTENT',
        status: 'PENDING',
        priority,
        maxAttempts: 3,
        data: { newsId, jobId: job.id },
      },
    });

    return job;
  }

  async addMediaGenerationJob(newsId: string, title: string, priority: number = 0) {
    this.logger.log(`Adding media generation job for news: ${newsId}`);
    
    const job = await this.mediaQueue.add(
      'generate-image',
      { newsId, title },
      {
        priority,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      }
    );

    await this.database.queueJob.create({
      data: {
        newsId,
        jobType: 'GENERATE_IMAGE',
        status: 'PENDING',
        priority,
        maxAttempts: 3,
        data: { newsId, title, jobId: job.id },
      },
    });

    return job;
  }

  async addPublicationJob(
    newsId: string, 
    platform: string, 
    priority: number = 0
  ) {
    this.logger.log(`Adding publication job for news: ${newsId} on ${platform}`);
    
    const job = await this.publicationQueue.add(
      'publish-to-social',
      { newsId, platform },
      {
        priority,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      }
    );

    await this.database.queueJob.create({
      data: {
        newsId,
        jobType: 'PUBLISH_TO_SOCIAL',
        status: 'PENDING',
        priority,
        maxAttempts: 3,
        data: { newsId, platform, jobId: job.id },
      },
    });

    return job;
  }

  async getQueueStats() {
    const [newsStats, mediaStats, publicationStats] = await Promise.all([
      this.getQueueStatistics(this.newsQueue),
      this.getQueueStatistics(this.mediaQueue),
      this.getQueueStatistics(this.publicationQueue),
    ]);

    return [
      {
        name: 'news-processing',
        ...newsStats,
      },
      {
        name: 'media-generation',
        ...mediaStats,
      },
      {
        name: 'social-publication',
        ...publicationStats,
      },
    ];
  }

  private async getQueueStatistics(queue: Queue) {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed(),
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
      paused: false, // Por enquanto sempre false, pode ser implementado depois
    };
  }

  async pauseQueue(queueName: string) {
    const queue = this.getQueueByName(queueName);
    if (queue) {
      await queue.pause();
      this.logger.log(`Queue ${queueName} paused`);
    }
  }

  async resumeQueue(queueName: string) {
    const queue = this.getQueueByName(queueName);
    if (queue) {
      await queue.resume();
      this.logger.log(`Queue ${queueName} resumed`);
    }
  }

  private getQueueByName(name: string): Queue | null {
    switch (name) {
      case 'news-processing':
        return this.newsQueue;
      case 'media-generation':
        return this.mediaQueue;
      case 'social-publication':
        return this.publicationQueue;
      default:
        return null;
    }
  }
}
