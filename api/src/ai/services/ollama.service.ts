import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OllamaService {
  private readonly logger = new Logger(OllamaService.name);
  private readonly config: any;
  private readonly baseUrl: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.config = this.configService.get('ai.ollama');
    this.baseUrl = this.config?.baseUrl || 'http://localhost:11434';
    
    this.logger.log(`Ollama Base URL: ${this.baseUrl}`);
    this.logger.log(`Ollama Config: ${JSON.stringify(this.config)}`);
  }

  async generateSummary(content: string): Promise<string | null> {
    try {
      const prompt = `Você é um jornalista brasileiro. Resuma esta notícia em português, máximo 150 palavras, focando nos pontos principais. Responda APENAS com o resumo, sem explicações adicionais:

${content}

RESUMO:`;

      const response = await this.callOllama(prompt);
      return response;

    } catch (error) {
      this.logger.error('Failed to generate summary:', error.message);
      return null;
    }
  }

  async generateHeadline(title: string, content: string): Promise<string | null> {
    try {
      const prompt = `Você é um editor de notícias brasileiro. Crie um título atrativo em português para esta notícia. Máximo 80 caracteres. Responda APENAS com o título, sem explicações:

Título original: ${title}
Conteúdo: ${content.substring(0, 300)}...

NOVO TÍTULO:`;

      const response = await this.callOllama(prompt);
      return response?.trim();

    } catch (error) {
      this.logger.error('Failed to generate headline:', error.message);
      return null;
    }
  }

  async generateCommentary(title: string, content: string): Promise<string | null> {
    try {
      const prompt = `Você é um analista político brasileiro. Escreva um comentário editorial sobre esta notícia em português. Máximo 120 palavras. Responda APENAS com o comentário, sem explicações:

Título: ${title}
Conteúdo: ${content.substring(0, 400)}...

COMENTÁRIO:`;

      const response = await this.callOllama(prompt);
      return response?.trim();

    } catch (error) {
      this.logger.error('Failed to generate commentary:', error.message);
      return null;
    }
  }

  async generateTags(title: string, content: string): Promise<string[]> {
    try {
      const prompt = `Gere 5 tags relevantes em português para esta notícia. Responda APENAS com as tags separadas por vírgulas:

Título: ${title}
Conteúdo: ${content.substring(0, 200)}...

TAGS:`;

      const response = await this.callOllama(prompt);
      if (!response) return [];

      return response
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0)
        .slice(0, 5);

    } catch (error) {
      this.logger.error('Failed to generate tags:', error.message);
      return [];
    }
  }

  private async callOllama(prompt: string): Promise<string | null> {
    try {
      const url = `${this.baseUrl}/api/generate`;
      const payload = {
        model: this.config.model || 'llama3.2:1b',
        prompt: prompt,
        stream: false,
        options: {
          num_predict: this.config.maxTokens || 200,
          temperature: 0.3, // Mais determinístico
          top_p: 0.9,
          repeat_penalty: 1.1,
          stop: ['\n\n', 'EXPLICAÇÃO:', 'NOTA:', 'OBS:'], // Para parar explicações extras
        },
      };

      this.logger.debug(`Calling Ollama: ${url}`);
      
      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          timeout: 30000,
        })
      );

      return response.data?.response?.trim() || null;

    } catch (error) {
      this.logger.error('Failed to call Ollama API:', error.message);
      return null;
    }
  }
}
