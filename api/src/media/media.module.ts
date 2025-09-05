import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { TemplateService } from './services/template.service';
import { SimpleImageGeneratorService } from './services/simple-image-generator.service';
import { StorageService, LocalStorageProvider } from './services/storage.service';
import { ImageConverterService } from './services/image-converter.service';

@Module({
  imports: [HttpModule],
  controllers: [MediaController],
  providers: [
    MediaService,
    TemplateService,
    SimpleImageGeneratorService,
    StorageService,
    ImageConverterService,
    LocalStorageProvider,
    // S3StorageProvider, // Uncomment when implementing S3
  ],
  exports: [
    MediaService,
    TemplateService,
    SimpleImageGeneratorService,
    StorageService,
    ImageConverterService,
  ],
})
export class MediaModule {}
