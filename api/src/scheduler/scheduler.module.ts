import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { NewsModule } from '../news/news.module';
import { ProvidersModule } from '../providers/providers.module';
import { QueueModule } from '../queue/queue.module';
import { AiModule } from '../ai/ai.module';
import { DatabaseModule } from '../database/database.module';
import { SchedulerService } from './scheduler.service';
import { NewsSchedulerService } from './services/news-scheduler.service';

@Module({
  imports: [HttpModule, ConfigModule, NewsModule, ProvidersModule, QueueModule, AiModule, DatabaseModule],
  providers: [SchedulerService, NewsSchedulerService],
  exports: [SchedulerService, NewsSchedulerService],
})
export class SchedulerModule {}
