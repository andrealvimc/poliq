import { Module } from '@nestjs/common';

import { MediaModule } from '../media/media.module';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import { SocialMediaService } from './services/social-media.service';

@Module({
  imports: [MediaModule],
  controllers: [PublicationController],
  providers: [PublicationService, SocialMediaService],
  exports: [PublicationService, SocialMediaService],
})
export class PublicationModule {}
