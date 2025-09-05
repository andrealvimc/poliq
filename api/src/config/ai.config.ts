import { registerAs } from '@nestjs/config';

export const aiConfig = registerAs('ai', () => ({
  provider: process.env.AI_PROVIDER || 'openai', // 'openai' or 'ollama'
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo', // Mais barato e eficiente
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS, 10) || 500, // Reduzir tokens para economizar
  },
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama3.2', // Modelo gratuito local
    maxTokens: parseInt(process.env.OLLAMA_MAX_TOKENS, 10) || 500,
  },
  // Image generation is handled by MediaModule using Node Canvas
  // No external APIs needed for image generation
}));
