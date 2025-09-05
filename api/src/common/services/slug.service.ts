import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

@Injectable()
export class SlugService {
  generateSlug(text: string): string {
    return slugify(text, {
      lower: true,
      strict: true,
      locale: 'pt',
      remove: /[*+~.()'"!:@]/g,
    });
  }

  generateUniqueSlug(text: string, existingSlugs: string[] = []): string {
    const baseSlug = this.generateSlug(text);
    
    if (!existingSlugs.includes(baseSlug)) {
      return baseSlug;
    }

    let counter = 1;
    let uniqueSlug = `${baseSlug}-${counter}`;
    
    while (existingSlugs.includes(uniqueSlug)) {
      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }

    return uniqueSlug;
  }
}
