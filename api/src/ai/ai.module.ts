import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { OpenaiService } from './services/openai.service';
import { OllamaService } from './services/ollama.service';
import { ContentProcessorService } from './services/content-processor.service';

@Module({
  imports: [HttpModule],
  controllers: [AiController],
  providers: [AiService, OpenaiService, OllamaService, ContentProcessorService],
  exports: [AiService, OpenaiService, OllamaService, ContentProcessorService],
})
export class AiModule {}
