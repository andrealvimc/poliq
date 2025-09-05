import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { GnewsService } from './services/gnews.service';
import { ExternalSourceService } from './services/external-source.service';
import { NewsSchedulerService } from '../scheduler/services/news-scheduler.service';
import { NewsModule } from '../news/news.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [HttpModule, NewsModule, QueueModule],
  controllers: [ProvidersController],
  providers: [ProvidersService, GnewsService, ExternalSourceService, NewsSchedulerService],
  exports: [ProvidersService, GnewsService, ExternalSourceService],
})
export class ProvidersModule {}
