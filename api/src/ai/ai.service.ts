import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OpenaiService } from './services/openai.service';
import { OllamaService } from './services/ollama.service';
import { ContentProcessorService } from './services/content-processor.service';
import { NewsProcessingResult } from './interfaces/ai-processing.interface';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  private readonly aiProvider: string;

  constructor(
    private configService: ConfigService,
    private openaiService: OpenaiService,
    private ollamaService: OllamaService,
    private contentProcessorService: ContentProcessorService,
  ) {
    this.aiProvider = this.configService.get('ai.provider') || 'openai';
    this.logger.log(`AI Provider: ${this.aiProvider}`);
  }

  async processNewsContent(
    title: string,
    content?: string,
    originalSource?: string,
  ): Promise<NewsProcessingResult> {
    this.logger.log(`Processing news content: ${title}`);

    try {
      const [summary, headline, commentary, rewrittenContent] = await Promise.all([
        this.generateSummary(title, content),
        this.generateHeadline(title, content),
        this.generateCommentary(title, content, originalSource),
        this.generateRewrittenContent(title, content, originalSource),
      ]);

      const result: NewsProcessingResult = {
        summary,
        headline,
        commentary,
        content: rewrittenContent,
        processed: true,
        processedAt: new Date(),
      };

      this.logger.log(`Successfully processed news content: ${title}`);
      return result;

    } catch (error) {
      this.logger.error(`Failed to process news content: ${title}`, error.message);
      
      return {
        summary: null,
        headline: null,
        commentary: null,
        content: null,
        processed: false,
        processedAt: new Date(),
        error: error.message,
      };
    }
  }

  async generateSummary(title: string, content?: string): Promise<string | null> {
    if (!content && !title) {
      return null;
    }

    const text = content || title;
    
    if (this.aiProvider === 'ollama') {
      return this.ollamaService.generateSummary(text);
    }
    
    return this.openaiService.generateSummary(text);
  }

  async generateHeadline(title: string, content?: string): Promise<string | null> {
    if (!title) {
      return null;
    }

    if (this.aiProvider === 'ollama') {
      return this.ollamaService.generateHeadline(title, content);
    }

    return this.openaiService.generateHeadline(title, content);
  }

  async generateCommentary(
    title: string, 
    content?: string, 
    source?: string
  ): Promise<string | null> {
    if (!content && !title) {
      return null;
    }

    const text = content || title;
    
    if (this.aiProvider === 'ollama') {
      return this.ollamaService.generateCommentary(title, text);
    }
    
    return this.openaiService.generateCommentary(text, source);
  }

  async extractKeywords(text: string): Promise<string[]> {
    return this.contentProcessorService.extractKeywords(text);
  }

  async categorizeContent(title: string, content?: string): Promise<string[]> {
    return this.contentProcessorService.categorizeContent(title, content);
  }

  async detectLanguage(text: string): Promise<string> {
    return this.contentProcessorService.detectLanguage(text);
  }

  async generateTags(title: string, content?: string): Promise<string[]> {
    const keywords = await this.extractKeywords(`${title} ${content || ''}`);
    const categories = await this.categorizeContent(title, content);
    
    // Combine and deduplicate
    const allTags = [...keywords, ...categories];
    return [...new Set(allTags)].slice(0, 10); // Limit to 10 tags
  }

  async generateRewrittenContent(title: string, content?: string, originalSource?: string): Promise<string | null> {
    if (!content && !title) {
      return null;
    }

    const text = content || title;
    
    if (this.aiProvider === 'ollama') {
      return this.ollamaService.generateRewrittenContent(text, originalSource);
    }
    
    return this.openaiService.generateRewrittenContent(text, originalSource);
  }
}
