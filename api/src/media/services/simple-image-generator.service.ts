import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';

import { ImageTemplate, ImageGenerationData } from '../interfaces/template.interface';

@Injectable()
export class SimpleImageGeneratorService {
  private readonly logger = new Logger(SimpleImageGeneratorService.name);

  async generateImage(
    template: ImageTemplate,
    data: ImageGenerationData,
  ): Promise<Buffer> {
    this.logger.log(`Generating simple placeholder image for: ${data.title}`);

    try {
      // Create a simple SVG image as placeholder
      const svg = this.createSvgImage(template, data);
      
      // Convert SVG string to Buffer
      const buffer = Buffer.from(svg, 'utf-8');

      this.logger.log(`Simple image generated successfully: ${buffer.length} bytes`);
      return buffer;

    } catch (error) {
      this.logger.error('Failed to generate simple image:', error.message);
      throw new Error(`Simple image generation failed: ${error.message}`);
    }
  }

  private createSvgImage(template: ImageTemplate, data: ImageGenerationData): string {
    const { width, height } = template.dimensions;
    const backgroundColor = template.background.value || '#1e3a8a';
    
    // Create gradient if enabled
    let backgroundFill = backgroundColor;
    let gradientDef = '';
    let backgroundImage = '';
    
    if (template.background.gradient?.enabled && template.background.gradient.colors.length >= 2) {
      gradientDef = `
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            ${template.background.gradient.colors.map((color, index) => 
              `<stop offset="${(index / (template.background.gradient.colors.length - 1)) * 100}%" stop-color="${color}"/>`
            ).join('')}
          </linearGradient>
        </defs>
      `;
      backgroundFill = 'url(#bgGradient)';
    }

    // Add background image if provided
    if (data.backgroundImage && template.overlays?.backgroundImage?.enabled) {
      const overlay = template.overlays.backgroundImage;
      const opacity = overlay.opacity ?? 1.0;
      
      backgroundImage = `
        <image href="${data.backgroundImage}" 
               x="${overlay.position?.x || 0}" 
               y="${overlay.position?.y || 0}" 
               width="${overlay.position?.width || width}" 
               height="${overlay.position?.height || height}" 
               opacity="${opacity}"
               preserveAspectRatio="xMidYMid slice"/>
      `;
    }

    // Build SVG content
    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${gradientDef}
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="${backgroundFill}"/>
      
      <!-- Background Image (if provided) -->
      ${backgroundImage}
      
      <!-- White footer banner for text -->
      <rect x="0" y="830" width="${width}" height="250" fill="#ffffff"/>
      
      <!-- Accent line (if exists) -->
      ${template.elements.accent ? `<rect x="0" y="0" width="8" height="${height}" fill="#ef4444"/>` : ''}
      
      <!-- Category badge -->
      ${this.renderCategory(template, data)}
      
      <!-- Title -->
      ${this.renderTitle(template, data)}
      
      <!-- Subtitle -->
      ${this.renderSubtitle(template, data)}
      
      <!-- Logo -->
      ${this.renderLogo(template)}
    </svg>`;

    return svgContent;
  }

  private renderCategory(template: ImageTemplate, data: ImageGenerationData): string {
    if (!template.elements.category || !data.category) return '';
    
    const element = template.elements.category;
    const { x, y } = element.position;
    const style = element.style;
    
    const text = data.category.toUpperCase();
    const textWidth = text.length * 10; // Approximate
    const padding = style.padding || { horizontal: 16, vertical: 8 };
    
    return `
      <rect x="${x}" y="${y}" 
            width="${textWidth + padding.horizontal * 2}" 
            height="${(style.fontSize || 16) + padding.vertical * 2}"
            fill="${style.backgroundColor || '#ef4444'}" 
            rx="${style.borderRadius || 4}"/>
      <text x="${x + padding.horizontal}" 
            y="${y + (style.fontSize || 16) + padding.vertical}" 
            font-family="${style.fontFamily || 'Arial'}" 
            font-size="${style.fontSize || 16}"
            font-weight="${style.fontWeight || 'bold'}"
            fill="${style.color || '#ffffff'}">${text}</text>
    `;
  }

  private renderTitle(template: ImageTemplate, data: ImageGenerationData): string {
    if (!template.elements.title || !data.title) return '';
    
    const element = template.elements.title;
    const { x, y, maxWidth } = element.position;
    const style = element.style;
    
    // Simple text wrapping
    const words = data.title.split(' ');
    const maxCharsPerLine = Math.floor((maxWidth || 1000) / ((style.fontSize || 48) * 0.6));
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      if ((currentLine + word).length <= maxCharsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    
    // Limit lines
    const maxLines = style.maxLines || 3;
    const displayLines = lines.slice(0, maxLines);
    if (lines.length > maxLines) {
      displayLines[maxLines - 1] += '...';
    }
    
    const lineHeight = (style.fontSize || 48) * (style.lineHeight || 1.2);
    
    return displayLines.map((line, index) => `
      <text x="${x}" 
            y="${y + (style.fontSize || 48) + (index * lineHeight)}" 
            font-family="${style.fontFamily || 'Arial'}" 
            font-size="${style.fontSize || 48}"
            font-weight="${style.fontWeight || 'bold'}"
            fill="${style.color || '#ffffff'}">${line}</text>
    `).join('');
  }

  private renderSubtitle(template: ImageTemplate, data: ImageGenerationData): string {
    if (!template.elements.subtitle || !data.subtitle) return '';
    
    const element = template.elements.subtitle;
    const { x, y, maxWidth } = element.position;
    const style = element.style;
    
    // Simple text wrapping for subtitle
    const words = data.subtitle.split(' ');
    const maxCharsPerLine = Math.floor((maxWidth || 1000) / ((style.fontSize || 24) * 0.6));
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      if ((currentLine + word).length <= maxCharsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    
    const maxLines = style.maxLines || 2;
    const displayLines = lines.slice(0, maxLines);
    if (lines.length > maxLines) {
      displayLines[maxLines - 1] += '...';
    }
    
    const lineHeight = (style.fontSize || 24) * (style.lineHeight || 1.3);
    
    return displayLines.map((line, index) => `
      <text x="${x}" 
            y="${y + (style.fontSize || 24) + (index * lineHeight)}" 
            font-family="${style.fontFamily || 'Arial'}" 
            font-size="${style.fontSize || 24}"
            font-weight="${style.fontWeight || 'normal'}"
            fill="${style.color || '#cbd5e1'}">${line}</text>
    `).join('');
  }

  private renderLogo(template: ImageTemplate): string {
    if (!template.elements.logo) return '';
    
    const element = template.elements.logo;
    const { x, y } = element.position;
    const style = element.style;
    
    return `
      <text x="${x}" 
            y="${y + (style.fontSize || 24)}" 
            font-family="${style.fontFamily || 'Arial'}" 
            font-size="${style.fontSize || 24}"
            font-weight="${style.fontWeight || 'bold'}"
            fill="${style.color || '#ffffff'}"
            text-anchor="end">${style.text || 'POLIQ'}</text>
    `;
  }
}
