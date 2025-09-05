export interface NewsProviderResult {
  title: string;
  description?: string;
  content?: string;
  url: string;
  source: string;
  category?: string;
  publishedAt: Date;
  imageUrl?: string;
  author?: string;
  tags?: string[];
}

export interface NewsProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  maxResults?: number;
  language?: string;
  country?: string;
  category?: string;
}
