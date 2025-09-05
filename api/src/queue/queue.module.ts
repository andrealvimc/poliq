import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { AiModule } from '../ai/ai.module';
import { MediaModule } from '../media/media.module';
import { PublicationModule } from '../publication/publication.module';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { NewsProcessor } from './processors/news.processor';
import { MediaProcessor } from './processors/media.processor';
import { PublicationProcessor } from './processors/publication.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'news-processing' },
      { name: 'media-generation' },
      { name: 'social-publication' },
    ),
    AiModule,
    MediaModule,
    PublicationModule,
  ],
  controllers: [QueueController],
  providers: [QueueService, NewsProcessor, MediaProcessor, PublicationProcessor],
  exports: [QueueService],
})
export class QueueModule {}
