import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

import { ImageTemplate, ImageGenerationData } from '../interfaces/template.interface';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  private readonly templatesPath = join(process.cwd(), 'src', 'media', 'templates');
  private templateCache = new Map<string, ImageTemplate>();

  async loadTemplate(templateName: string): Promise<ImageTemplate> {
    // Check cache first
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName);
    }

    try {
      const templatePath = join(this.templatesPath, `${templateName}.json`);
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      const template: ImageTemplate = JSON.parse(templateContent);

      // Validate template structure
      this.validateTemplate(template);

      // Cache the template
      this.templateCache.set(templateName, template);

      this.logger.log(`Template '${templateName}' loaded successfully`);
      return template;

    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException(`Template '${templateName}' not found`);
      }
      this.logger.error(`Failed to load template '${templateName}':`, error.message);
      throw new Error(`Failed to load template: ${error.message}`);
    }
  }

  async getAvailableTemplates(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.templatesPath);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    } catch (error) {
      this.logger.error('Failed to list templates:', error.message);
      return [];
    }
  }

  async mergeTemplateWithData(
    template: ImageTemplate,
    data: ImageGenerationData,
  ): Promise<ImageTemplate> {
    // Create a deep copy of the template
    const mergedTemplate: ImageTemplate = JSON.parse(JSON.stringify(template));

    // Apply background image if provided
    if (data.backgroundImage && mergedTemplate.overlays?.backgroundImage) {
      mergedTemplate.overlays.backgroundImage.enabled = true;
    }

    return mergedTemplate;
  }

  validateTemplate(template: ImageTemplate): void {
    if (!template.name) {
      throw new Error('Template must have a name');
    }

    if (!template.dimensions || !template.dimensions.width || !template.dimensions.height) {
      throw new Error('Template must have valid dimensions');
    }

    if (!template.background || !template.background.type || !template.background.value) {
      throw new Error('Template must have a valid background');
    }

    if (!template.elements || !template.elements.title) {
      throw new Error('Template must have at least a title element');
    }

    // Validate title element
    const titleElement = template.elements.title;
    if (!titleElement.position || typeof titleElement.position.x !== 'number' || typeof titleElement.position.y !== 'number') {
      throw new Error('Title element must have valid position coordinates');
    }

    if (!titleElement.style || !titleElement.style.color || !titleElement.style.fontSize) {
      throw new Error('Title element must have valid style properties');
    }
  }

  clearCache(): void {
    this.templateCache.clear();
    this.logger.log('Template cache cleared');
  }

  async reloadTemplate(templateName: string): Promise<ImageTemplate> {
    this.templateCache.delete(templateName);
    return this.loadTemplate(templateName);
  }

  getTemplateFromCache(templateName: string): ImageTemplate | undefined {
    return this.templateCache.get(templateName);
  }
}
