export interface NewsProcessingResult {
  summary: string | null;
  headline: string | null;
  commentary: string | null;
  content: string | null; 
  processed: boolean;
  processedAt: Date;
  error?: string;
}

export interface AiPromptConfig {
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

export interface ContentAnalysis {
  keywords: string[];
  categories: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  language: string;
  readabilityScore?: number;
}
