import { Module } from '@nestjs/common';

import { NewsModule } from '../news/news.module';
import { ProvidersModule } from '../providers/providers.module';
import { QueueModule } from '../queue/queue.module';
import { SchedulerService } from './scheduler.service';
import { NewsSchedulerService } from './services/news-scheduler.service';

@Module({
  imports: [NewsModule, ProvidersModule, QueueModule],
  providers: [SchedulerService, NewsSchedulerService],
  exports: [SchedulerService, NewsSchedulerService],
})
export class SchedulerModule {}
