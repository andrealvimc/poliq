import { Injectable, Logger } from '@nestjs/common';
import { createCanvas, loadImage, Canvas, CanvasRenderingContext2D, Image } from 'canvas';
import { promises as fs } from 'fs';

import { ImageTemplate, ImageGenerationData, TemplateElement, TemplateStyle } from '../interfaces/template.interface';

@Injectable()
export class ImageGeneratorService {
  private readonly logger = new Logger(ImageGeneratorService.name);

  async generateImage(
    template: ImageTemplate,
    data: ImageGenerationData,
  ): Promise<Buffer> {
    this.logger.log(`Generating image with template: ${template.name}`);

    try {
      // Create canvas
      const canvas = createCanvas(template.dimensions.width, template.dimensions.height);
      const ctx = canvas.getContext('2d');

      // Draw background
      await this.drawBackground(ctx, template, data);

      // Draw background image if provided
      if (data.backgroundImage && template.overlays?.backgroundImage?.enabled) {
        await this.drawBackgroundImage(ctx, template, data.backgroundImage);
      }

      // Draw elements in order
      if (template.elements.accent) {
        await this.drawElement(ctx, template.elements.accent, '');
      }

      if (template.elements.category && data.category) {
        await this.drawElement(ctx, template.elements.category, data.category);
      }

      if (template.elements.title) {
        await this.drawElement(ctx, template.elements.title, data.title);
      }

      if (template.elements.subtitle && data.subtitle) {
        await this.drawElement(ctx, template.elements.subtitle, data.subtitle);
      }

      if (template.elements.logo) {
        await this.drawElement(ctx, template.elements.logo, template.elements.logo.style.text || 'POLIQ');
      }

      // Convert to buffer based on format
      let buffer: Buffer;
      switch (data.format || 'png') {
        case 'jpeg':
          buffer = canvas.toBuffer('image/jpeg', { quality: (data.quality || 90) / 100 });
          break;
        case 'webp':
          // Canvas doesn't support WebP directly, fallback to PNG
          buffer = canvas.toBuffer('image/png');
          break;
        case 'png':
        default:
          buffer = canvas.toBuffer('image/png');
          break;
      }

      this.logger.log(`Image generated successfully: ${buffer.length} bytes`);
      return buffer;

    } catch (error) {
      this.logger.error('Failed to generate image:', error.message);
      throw new Error(`Image generation failed: ${error.message}`);
    }
  }

  private async drawBackground(
    ctx: CanvasRenderingContext2D,
    template: ImageTemplate,
    data: ImageGenerationData,
  ): Promise<void> {
    const { background, dimensions } = template;

    if (background.type === 'color') {
      ctx.fillStyle = background.value;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    }

    // Add gradient if enabled
    if (background.gradient?.enabled && background.gradient.colors.length >= 2) {
      const gradient = this.createGradient(ctx, background.gradient, dimensions);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    }
  }

  private async drawBackgroundImage(
    ctx: CanvasRenderingContext2D,
    template: ImageTemplate,
    imageUrl: string,
  ): Promise<void> {
    try {
      const image = await loadImage(imageUrl);
      const overlay = template.overlays.backgroundImage;

      ctx.save();
      ctx.globalAlpha = overlay.opacity || 0.1;

      if (overlay.position) {
        ctx.drawImage(
          image,
          overlay.position.x,
          overlay.position.y,
          overlay.position.width || template.dimensions.width,
          overlay.position.height || template.dimensions.height,
        );
      } else {
        ctx.drawImage(image, 0, 0, template.dimensions.width, template.dimensions.height);
      }

      ctx.restore();
    } catch (error) {
      this.logger.warn(`Failed to load background image: ${imageUrl}`, error.message);
    }
  }

  private async drawElement(
    ctx: CanvasRenderingContext2D,
    element: TemplateElement,
    text: string,
  ): Promise<void> {
    if (!element.enabled && element.enabled !== undefined) {
      return;
    }

    const { position, style, type = 'text' } = element;

    ctx.save();

    if (type === 'rectangle') {
      // Draw rectangle/accent
      ctx.fillStyle = style.backgroundColor || '#000000';
      ctx.fillRect(
        position.x,
        position.y,
        position.width || style.width || 100,
        position.height || style.height || 100,
      );
    } else if (type === 'text' || !type) {
      // Draw text element
      await this.drawTextElement(ctx, element, text);
    }

    ctx.restore();
  }

  private async drawTextElement(
    ctx: CanvasRenderingContext2D,
    element: TemplateElement,
    text: string,
  ): Promise<void> {
    const { position, style } = element;

    // Set font
    const fontSize = style.fontSize || 16;
    const fontFamily = style.fontFamily || 'Arial';
    const fontWeight = style.fontWeight || 'normal';
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    // Set text color
    ctx.fillStyle = style.color || '#000000';
    ctx.textAlign = (style.textAlign as CanvasTextAlign) || 'left';

    // Transform text if needed
    let displayText = text;
    if (style.textTransform === 'uppercase') {
      displayText = text.toUpperCase();
    } else if (style.textTransform === 'lowercase') {
      displayText = text.toLowerCase();
    } else if (style.textTransform === 'capitalize') {
      displayText = text.replace(/\b\w/g, l => l.toUpperCase());
    }

    // Handle background for category/tags
    if (style.backgroundColor) {
      const textMetrics = ctx.measureText(displayText);
      const padding = style.padding || { horizontal: 8, vertical: 4 };
      
      const bgWidth = textMetrics.width + (padding.horizontal * 2);
      const bgHeight = fontSize + (padding.vertical * 2);

      ctx.fillStyle = style.backgroundColor;
      
      if (style.borderRadius) {
        this.drawRoundedRect(ctx, position.x, position.y - padding.vertical, bgWidth, bgHeight, style.borderRadius);
      } else {
        ctx.fillRect(position.x, position.y - padding.vertical, bgWidth, bgHeight);
      }

      // Reset text color
      ctx.fillStyle = style.color || '#ffffff';
      ctx.fillText(displayText, position.x + padding.horizontal, position.y + fontSize - padding.vertical);
    } else {
      // Handle multi-line text
      if (position.maxWidth && style.maxLines && style.maxLines > 1) {
        this.drawMultilineText(ctx, displayText, position.x, position.y, position.maxWidth, fontSize * (style.lineHeight || 1.2), style.maxLines);
      } else {
        ctx.fillText(displayText, position.x, position.y + fontSize);
      }
    }
  }

  private drawMultilineText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number,
  ): void {
    const words = text.split(' ');
    let line = '';
    let lineCount = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, y + (lineCount * lineHeight));
        line = words[n] + ' ';
        lineCount++;

        if (lineCount >= maxLines) {
          // Truncate with ellipsis
          const truncatedLine = line.trim() + '...';
          ctx.fillText(truncatedLine, x, y + (lineCount * lineHeight));
          break;
        }
      } else {
        line = testLine;
      }
    }

    if (lineCount < maxLines) {
      ctx.fillText(line.trim(), x, y + (lineCount * lineHeight));
    }
  }

  private drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }

  private createGradient(
    ctx: CanvasRenderingContext2D,
    gradientConfig: any,
    dimensions: { width: number; height: number },
  ): CanvasGradient {
    let gradient: CanvasGradient;

    switch (gradientConfig.direction) {
      case 'horizontal':
        gradient = ctx.createLinearGradient(0, 0, dimensions.width, 0);
        break;
      case 'vertical':
        gradient = ctx.createLinearGradient(0, 0, 0, dimensions.height);
        break;
      case 'diagonal':
      default:
        gradient = ctx.createLinearGradient(0, 0, dimensions.width, dimensions.height);
        break;
    }

    gradientConfig.colors.forEach((color: string, index: number) => {
      gradient.addColorStop(index / (gradientConfig.colors.length - 1), color);
    });

    return gradient;
  }
}
