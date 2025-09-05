import { Injectable, Logger } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImageConverterService {
  private readonly logger = new Logger(ImageConverterService.name);

  /**
   * Convert SVG string to PNG buffer
   */
  async svgToPng(svgString: string, width = 1080, height = 1080): Promise<Buffer> {
    try {
      this.logger.log(`Converting SVG to PNG (${width}x${height})`);
      
      const pngBuffer = await sharp(Buffer.from(svgString))
        .resize(width, height)
        .png({
          quality: 90,
          compressionLevel: 6,
        })
        .toBuffer();

      this.logger.log(`SVG converted to PNG successfully. Size: ${pngBuffer.length} bytes`);
      return pngBuffer;
    } catch (error) {
      this.logger.error('Failed to convert SVG to PNG:', error.message);
      throw new Error(`SVG to PNG conversion failed: ${error.message}`);
    }
  }

  /**
   * Convert SVG string to JPG buffer
   */
  async svgToJpg(svgString: string, width = 1080, height = 1080): Promise<Buffer> {
    try {
      this.logger.log(`Converting SVG to JPG (${width}x${height})`);
      
      const jpgBuffer = await sharp(Buffer.from(svgString))
        .resize(width, height)
        .jpeg({
          quality: 85,
          progressive: true,
        })
        .toBuffer();

      this.logger.log(`SVG converted to JPG successfully. Size: ${jpgBuffer.length} bytes`);
      return jpgBuffer;
    } catch (error) {
      this.logger.error('Failed to convert SVG to JPG:', error.message);
      throw new Error(`SVG to JPG conversion failed: ${error.message}`);
    }
  }

  /**
   * Convert SVG to specified format
   */
  async convertSvg(svgString: string, format: 'png' | 'jpg' | 'jpeg' | 'svg', width = 1080, height = 1080): Promise<{ buffer: Buffer; mimeType: string; extension: string }> {
    switch (format.toLowerCase()) {
      case 'png':
        return {
          buffer: await this.svgToPng(svgString, width, height),
          mimeType: 'image/png',
          extension: 'png'
        };
      
      case 'jpg':
      case 'jpeg':
        return {
          buffer: await this.svgToJpg(svgString, width, height),
          mimeType: 'image/jpeg',
          extension: 'jpg'
        };
      
      case 'svg':
      default:
        return {
          buffer: Buffer.from(svgString),
          mimeType: 'image/svg+xml',
          extension: 'svg'
        };
    }
  }
}
