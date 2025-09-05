import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { GnewsService } from './services/gnews.service';
import { HybridNewsService } from './services/hybrid-news.service';
import { ExternalSourceService } from './services/external-source.service';
import { ContentProcessorService } from '../ai/services/content-processor.service';
import { NewsSchedulerService } from '../scheduler/services/news-scheduler.service';
import { NewsModule } from '../news/news.module';
import { QueueModule } from '../queue/queue.module';
import { DatabaseModule } from '../database/database.module';
import { AiModule } from '../ai/ai.module';
import { RSSTestController } from './controllers/rss-test.controller';

@Module({
  imports: [HttpModule, ConfigModule, NewsModule, QueueModule, DatabaseModule, AiModule],
  controllers: [ProvidersController, RSSTestController],
  providers: [ProvidersService, GnewsService, HybridNewsService, ExternalSourceService, ContentProcessorService, NewsSchedulerService],
  exports: [ProvidersService, GnewsService, HybridNewsService, ExternalSourceService, ContentProcessorService],
})
export class ProvidersModule {}
