import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

import { NewsSchedulerService } from './services/news-scheduler.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private newsSchedulerService: NewsSchedulerService,
    private configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async fetchNewsFromSources() {
    this.logger.log('Starting scheduled news fetch from external sources');
    
    try {
      await this.newsSchedulerService.fetchAndProcessNews();
      this.logger.log('Scheduled news fetch completed successfully');
    } catch (error) {
      this.logger.error('Scheduled news fetch failed:', error.message);
    }
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async processUnprocessedNews() {
    this.logger.log('Starting scheduled processing of unprocessed news');
    
    try {
      await this.newsSchedulerService.processUnprocessedNews();
      this.logger.log('Scheduled news processing completed successfully');
    } catch (error) {
      this.logger.error('Scheduled news processing failed:', error.message);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async generateDailyReport() {
    this.logger.log('Generating daily report');
    
    try {
      await this.newsSchedulerService.generateDailyReport();
      this.logger.log('Daily report generated successfully');
    } catch (error) {
      this.logger.error('Daily report generation failed:', error.message);
    }
  }

  @Cron(CronExpression.EVERY_WEEK)
  async cleanupOldJobs() {
    this.logger.log('Starting cleanup of old queue jobs');
    
    try {
      await this.newsSchedulerService.cleanupOldJobs();
      this.logger.log('Old jobs cleanup completed successfully');
    } catch (error) {
      this.logger.error('Old jobs cleanup failed:', error.message);
    }
  }
}
