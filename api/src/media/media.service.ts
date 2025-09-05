import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { TemplateService } from './services/template.service';
import { SimpleImageGeneratorService } from './services/simple-image-generator.service';
import { StorageService, StorageResult } from './services/storage.service';
import { ImageConverterService } from './services/image-converter.service';
import { GenerateImageDto } from './dto/generate-image.dto';
import { ImageGenerationData } from './interfaces/template.interface';

export interface ImageGenerationResult {
  success: boolean;
  url?: string;
  path?: string;
  filename?: string;
  metadata?: {
    template: string;
    dimensions: { width: number; height: number };
    format: string;
    mimeType?: string;
    size: number;
  };
  error?: string;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private templateService: TemplateService,
    private imageGeneratorService: SimpleImageGeneratorService,
    private imageConverterService: ImageConverterService,
    private storageService: StorageService,
    private httpService: HttpService,
  ) {}

  async generateImage(dto: GenerateImageDto): Promise<ImageGenerationResult> {
    this.logger.log(`Generating image with template: ${dto.template}`);

    try {
      // Load template
      const template = await this.templateService.loadTemplate(dto.template);

      // Download and cache background image if provided
      let localBackgroundImage = dto.backgroundImage;
      if (dto.backgroundImage && dto.backgroundImage.startsWith('http')) {
        localBackgroundImage = await this.downloadAndCacheImage(dto.backgroundImage);
      }

      // Prepare generation data
      const generationData: ImageGenerationData = {
        title: dto.title,
        subtitle: dto.subtitle,
        category: dto.category,
        backgroundImage: localBackgroundImage,
        template: dto.template,
        format: dto.format || 'png',
        quality: dto.quality || 90,
      };

      // Merge template with data
      const mergedTemplate = await this.templateService.mergeTemplateWithData(
        template,
        generationData,
      );

      // Generate SVG first
      const svgBuffer = await this.imageGeneratorService.generateImage(
        mergedTemplate,
        generationData,
      );

      // Convert to requested format
     const requestedFormat = dto.format || 'png';
      const svgString = svgBuffer.toString('utf-8');
      
      let finalBuffer: Buffer;
      let finalExtension: string;
      let mimeType: string;

      if (requestedFormat.toLowerCase() === 'svg') {
        finalBuffer = svgBuffer;
        finalExtension = 'svg';
        mimeType = 'image/svg+xml';
      } else { 
        // Convert SVG to PNG/JPG
        const conversion = await this.imageConverterService.convertSvg(
          svgString,
          requestedFormat as 'png' | 'jpg' | 'jpeg',
          template.dimensions.width,
          template.dimensions.height
        );
        finalBuffer = conversion.buffer;
        finalExtension = conversion.extension;
        mimeType = conversion.mimeType;
      }

      // Generate filename with correct extension
      const filename = this.storageService.generateFilename(
        dto.template,
        finalExtension,
      );

      const storageResult = await this.storageService.saveImage(
        finalBuffer,
        filename,
        {
          template: dto.template,
          title: dto.title,
          format: requestedFormat,
        },
      );

      const result: ImageGenerationResult = {
        success: true,
        url: storageResult.url,
        path: storageResult.path,
        filename: storageResult.filename,
        metadata: {
          template: dto.template,
          dimensions: template.dimensions,
          format: finalExtension,
          mimeType: mimeType,
          size: finalBuffer.length,
        },
      };

      this.logger.log(`Image generated successfully: ${storageResult.filename}`);
      return result;

    } catch (error) {
      this.logger.error('Failed to generate image:', error.message);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async generateImageBuffer(dto: GenerateImageDto): Promise<Buffer> {
    this.logger.log(`Generating image buffer with template: ${dto.template}`);

    // Load template
    const template = await this.templateService.loadTemplate(dto.template);

    // Prepare generation data
    const generationData: ImageGenerationData = {
      title: dto.title,
      subtitle: dto.subtitle,
      category: dto.category,
      backgroundImage: dto.backgroundImage,
      template: dto.template,
      format: dto.format || 'png',
      quality: dto.quality || 90,
    };

    // Merge template with data
    const mergedTemplate = await this.templateService.mergeTemplateWithData(
      template,
      generationData,
    );

    // Generate and return buffer
    return this.imageGeneratorService.generateImage(mergedTemplate, generationData);
  }

  async generateBase64Image(dto: GenerateImageDto): Promise<string> {
    const buffer = await this.generateImageBuffer(dto);
    const mimeType = this.getMimeType(dto.format || 'png');
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  }

  async getAvailableTemplates(): Promise<{
    templates: string[];
    count: number;
  }> {
    const templates = await this.templateService.getAvailableTemplates();
    return {
      templates,
      count: templates.length,
    };
  }

  async getTemplateDetails(templateName: string): Promise<any> {
    const template = await this.templateService.loadTemplate(templateName);
    return {
      name: template.name,
      description: template.description,
      dimensions: template.dimensions,
      elements: Object.keys(template.elements),
      backgroundType: template.background.type,
    };
  }

  async deleteImage(path: string): Promise<boolean> {
    return this.storageService.deleteImage(path);
  }

  async reloadTemplates(): Promise<void> {
    this.templateService.clearCache();
    this.logger.log('Template cache cleared and reloaded');
  }

  private getMimeType(format: string): string {
    switch (format) {
      case 'jpeg':
      case 'jpg':
        return 'image/jpeg';
      case 'webp':
        return 'image/webp';
      case 'png':
      default:
        return 'image/png';
    }
  }

  // Helper method for social media integration
  async generateSocialMediaImage(
    title: string,
    subtitle?: string,
    category?: string,
    platform: 'instagram' | 'facebook' | 'twitter' = 'instagram',
  ): Promise<ImageGenerationResult> {
    // Use appropriate template based on platform
    const template = platform === 'twitter' ? 'default' : 'infomoney';
    
    const dto: GenerateImageDto = {
      title,
      subtitle,
      category,
      template,
      format: 'png',
    };

    return this.generateImage(dto);
  }

  // Batch generation for multiple formats/sizes
  async generateImageVariants(
    dto: GenerateImageDto,
    variants: Array<{ format: string; quality?: number; suffix?: string }>,
  ): Promise<ImageGenerationResult[]> {
    const results: ImageGenerationResult[] = [];

    for (const variant of variants) {
      const variantDto: GenerateImageDto = {
        ...dto,
        format: variant.format as any,
        quality: variant.quality || dto.quality,
      };

      const result = await this.generateImage(variantDto);
      results.push(result);
    }

    return results;
  }

  private async downloadAndCacheImage(imageUrl: string): Promise<string> {
    try {
      this.logger.log(`Downloading background image: ${imageUrl}`);

      // Download the image
      const response = await firstValueFrom(
        this.httpService.get(imageUrl, {
          responseType: 'arraybuffer',
          timeout: 10000, // 10 seconds timeout
        })
      );

      // Get content type for data URI
      const contentType = response.headers['content-type'] || 'image/jpeg';
      
      // Convert to base64 data URI for SVG compatibility
      const buffer = Buffer.from(response.data);
      const base64Data = buffer.toString('base64');
      const dataUri = `data:${contentType};base64,${base64Data}`;

      this.logger.log(`Background image converted to data URI: ${dataUri.length} chars`);
      return dataUri;

    } catch (error) {
      this.logger.error(`Failed to download background image: ${imageUrl}`, error.message);
      // Return original URL as fallback
      return imageUrl;
    }
  }
}
