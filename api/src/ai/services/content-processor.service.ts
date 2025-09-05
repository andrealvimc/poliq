import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ContentProcessorService {
  private readonly logger = new Logger(ContentProcessorService.name);
  
  async extractKeywords(text: string): Promise<string[]> {
    // Simple keyword extraction - you can enhance this with NLP libraries
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);

    // Remove common stop words in Portuguese
    const stopWords = new Set([
      'para', 'com', 'não', 'uma', 'dos', 'mais', 'como', 'mas', 'foi',
      'pelo', 'pela', 'até', 'isso', 'ela', 'entre', 'depois', 'sem',
      'mesmo', 'aos', 'seus', 'quem', 'nas', 'são', 'pela', 'esse',
      'eles', 'esta', 'onde', 'quando', 'muito', 'nos', 'já', 'está',
      'seu', 'tem', 'foram', 'essa', 'num', 'nem', 'suas', 'meu',
      'às', 'minha', 'numa', 'pelos', 'elas', 'havia', 'seja', 'qual',
      'será', 'nós', 'tenho', 'lhe', 'deles', 'essas', 'esses', 'pelas',
      'este', 'fosse', 'dele', 'tu', 'te', 'vocês', 'vos', 'lhes',
      'meus', 'minhas', 'teu', 'tua', 'teus', 'tuas', 'nosso', 'nossa',
      'nossos', 'nossas', 'dela', 'delas', 'esta', 'estes', 'estas',
      'aquele', 'aquela', 'aqueles', 'aquelas', 'isto', 'aquilo'
    ]);

    const filtered = words.filter(word => !stopWords.has(word));
    
    // Count frequency and return most common
    const frequency = filtered.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  async cleanContent(content: string): Promise<string> {
    if (!content) return '';
    
    // Remove HTML tags but preserve paragraph structure
    let cleaned = content
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<p[^>]*>/gi, '')
      .replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    cleaned = cleaned
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'");
    
    // Remove GNews sharing buttons and social media elements
    cleaned = cleaned.replace(/^(Share\s*\n?Tweet\s*\n?Share\s*\n?Share\s*\n?E-mail\s*\n?)/gi, '');
    cleaned = cleaned.replace(/^(Compartilhar\s*\n?Tweetar\s*\n?Compartilhar\s*\n?Compartilhar\s*\n?E-mail\s*\n?)/gi, '');
    
    // Remove individual sharing terms
    cleaned = cleaned.replace(/\b(Share|Tweet|E-mail|Compartilhar|Tweetar)\b/gi, '');
    
    // Remove common truncation patterns
    cleaned = cleaned.replace(/\.\.\.\s*\[\d+\s*chars\]/gi, '');
    cleaned = cleaned.replace(/\.\.\.\s*\[truncated\]/gi, '');
    cleaned = cleaned.replace(/\.\.\.\s*\[more\]/gi, '');
    cleaned = cleaned.replace(/\.\.\.\s*\[leia mais\]/gi, '');
    cleaned = cleaned.replace(/\.\.\.\s*\[read more\]/gi, '');
    
    // Remove app download prompts
    cleaned = cleaned.replace(/📱Baixe o app do g1 para ver notícias em tempo real e de graça/gi, '');
    cleaned = cleaned.replace(/📱Download the g1 app to see real-time news for free/gi, '');
    cleaned = cleaned.replace(/Baixe o app do g1/gi, '');
    cleaned = cleaned.replace(/Download the g1 app/gi, '');
    
    // Remove photo credits and captions that are not part of the main content
    cleaned = cleaned.replace(/^[A-Z\s\/]+$/gm, ''); // Remove lines with only uppercase letters and slashes (photo credits)
    cleaned = cleaned.replace(/^[A-Z][A-Z\s]+$/gm, ''); // Remove lines with only uppercase words (captions)
    
    // Remove multiple consecutive periods
    cleaned = cleaned.replace(/\.{3,}/g, '...');
    
    // Clean up whitespace and line breaks
    cleaned = cleaned
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple line breaks to double
      .replace(/[ \t]+/g, ' ') // Multiple spaces to single
      .replace(/^\s+|\s+$/gm, '') // Trim each line
      .trim();
    
    // Remove any remaining sharing patterns at the start
    cleaned = cleaned.replace(/^(Share|Tweet|E-mail|Compartilhar|Tweetar)\s*/gi, '');
    
    // If content is too short after cleaning, it might be just metadata
    if (cleaned.length < 50) {
      this.logger.warn(`Content too short after cleaning (${cleaned.length} chars): ${cleaned.substring(0, 30)}...`);
    }
    
    return cleaned.trim();
  }

  async categorizeContent(title: string, content?: string): Promise<string[]> {
    const text = `${title} ${content || ''}`.toLowerCase();
    const categories: string[] = [];

    // Define category keywords
    const categoryMap = {
      'tecnologia': ['tecnologia', 'digital', 'internet', 'software', 'app', 'inteligência artificial', 'ia', 'blockchain', 'crypto'],
      'política': ['política', 'governo', 'presidente', 'ministro', 'eleição', 'congresso', 'senado', 'deputado'],
      'economia': ['economia', 'econômico', 'mercado', 'dólar', 'inflação', 'pib', 'bolsa', 'investimento', 'empresa'],
      'esportes': ['futebol', 'esporte', 'jogo', 'campeonato', 'time', 'atleta', 'olimpíada', 'copa'],
      'saúde': ['saúde', 'medicina', 'médico', 'hospital', 'doença', 'vacina', 'tratamento', 'pandemia'],
      'educação': ['educação', 'escola', 'universidade', 'ensino', 'professor', 'estudante', 'vestibular'],
      'cultura': ['cultura', 'arte', 'música', 'cinema', 'teatro', 'livro', 'festival', 'artista'],
      'meio-ambiente': ['meio ambiente', 'sustentabilidade', 'clima', 'aquecimento global', 'poluição', 'energia renovável'],
      'segurança': ['segurança', 'crime', 'violência', 'polícia', 'assalto', 'homicídio', 'prisão'],
      'internacional': ['internacional', 'mundo', 'global', 'país', 'europa', 'américa', 'ásia', 'áfrica']
    };

    Object.entries(categoryMap).forEach(([category, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        categories.push(category);
      }
    });

    return categories;
  }

  async detectLanguage(text: string): Promise<string> {
    // Simple language detection - you can use a proper library like franc
    const portugueseWords = ['que', 'não', 'uma', 'com', 'para', 'são', 'foi', 'como', 'mais', 'dos'];
    const englishWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had'];
    const spanishWords = ['que', 'con', 'para', 'son', 'fue', 'como', 'más', 'los', 'una', 'por'];

    const lowerText = text.toLowerCase();
    
    const ptCount = portugueseWords.filter(word => lowerText.includes(word)).length;
    const enCount = englishWords.filter(word => lowerText.includes(word)).length;
    const esCount = spanishWords.filter(word => lowerText.includes(word)).length;

    if (ptCount >= enCount && ptCount >= esCount) return 'pt';
    if (enCount >= esCount) return 'en';
    return 'es';
  }

  calculateReadabilityScore(text: string): number {
    // Simple readability score based on sentence and word length
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    
    if (sentences.length === 0 || words.length === 0) return 0;

    const avgWordsPerSentence = words.length / sentences.length;
    const avgCharsPerWord = words.reduce((sum, word) => sum + word.length, 0) / words.length;

    // Simple scoring (lower is better/easier to read)
    const score = Math.max(0, 100 - (avgWordsPerSentence * 2) - (avgCharsPerWord * 3));
    return Math.round(score);
  }
}
