import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private readonly logger = new Logger(OpenaiService.name);
  private readonly openai: OpenAI;
  private readonly config: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('ai.openai.apiKey');
    this.config = this.configService.get('ai.openai');
    
    this.logger.log(`OpenAI API Key: ${apiKey ? 'CONFIGURED' : 'NOT CONFIGURED'}`);
    this.logger.log(`OpenAI Config: ${JSON.stringify(this.config)}`);
    
    if (!apiKey) {
      this.logger.warn('OpenAI API key not configured');
      return;
    }

    this.openai = new OpenAI({
      apiKey,
    });
  }

  async generateSummary(content: string): Promise<string | null> {
    if (!this.openai) {
      this.logger.warn('OpenAI not initialized');
      return null;
    }

    try {
      const prompt = `
        Summarize the following news article in Portuguese in a concise and informative way.
        Keep it under 300 words and focus on the main points:

        ${content}
      `;

      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.config.maxTokens,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content?.trim() || null;

    } catch (error) {
      this.logger.error('Failed to generate summary:', error.message);
      return null;
    }
  }

  async generateHeadline(title: string, content?: string): Promise<string | null> {
    if (!this.openai) {
      this.logger.warn('OpenAI not initialized');
      return null;
    }

    try {
      const prompt = `
        Create a catchy and engaging headline in Portuguese for social media based on this news.
        Keep it under 100 characters and make it compelling:

        Title: ${title}
        ${content ? `Content: ${content.substring(0, 500)}...` : ''}
      `;

      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 50,
        temperature: 0.8,
      });

      return response.choices[0]?.message?.content?.trim() || null;

    } catch (error) {
      this.logger.error('Failed to generate headline:', error.message);
      return null;
    }
  }

  async generateCommentary(content: string, source?: string): Promise<string | null> {
    if (!this.openai) {
      this.logger.warn('OpenAI not initialized');
      return null;
    }

    try {
      const prompt = `
        Write a brief analytical commentary in Portuguese about this news item.
        Provide context, implications, or expert perspective. Maintain a professional and informative tone. You are a columnist for a right-wing newspaper in Brazil.
        Maximum 200 words:

        ${content}
        ${source ? `Source: ${source}` : ''}
      `;

      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.6,
      });

      return response.choices[0]?.message?.content?.trim() || null;

    } catch (error) {
      this.logger.error('Failed to generate commentary:', error.message);
      return null;
    }
  }

  async extractKeywords(text: string): Promise<string[]> {
    if (!this.openai) {
      this.logger.warn('OpenAI not initialized');
      return [];
    }

    try {
      const prompt = `
        Extract the most important keywords and phrases from this text in Portuguese.
        Return only a comma-separated list of keywords (maximum 8):

        ${text}
      `;

      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.3,
      });

      const keywords = response.choices[0]?.message?.content?.trim();
      return keywords ? keywords.split(',').map(k => k.trim()) : [];

    } catch (error) {
      this.logger.error('Failed to extract keywords:', error.message);
      return [];
    }
  }
}
