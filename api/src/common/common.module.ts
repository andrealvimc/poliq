import { Module } from '@nestjs/common';
import { SlugService } from './services/slug.service';
import { ValidationService } from './services/validation.service';

@Module({
  providers: [SlugService, ValidationService],
  exports: [SlugService, ValidationService],
})
export class CommonModule {}
