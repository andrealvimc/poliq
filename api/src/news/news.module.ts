import { Module } from '@nestjs/common';

import { CommonModule } from '../common/common.module';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  imports: [CommonModule],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
