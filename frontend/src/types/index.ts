// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

// News types
export interface News {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  originalLink?: string;
  originalSource?: string;
  tags: string[];
  status: NewsStatus;
  imageUrl?: string;
  aiProcessed?: boolean;
  aiSummary?: string;
  aiHeadline?: string;
  aiCommentary?: string;
  aiContent?: string;
  views?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export enum NewsStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface CreateNewsRequest {
  title: string;
  summary?: string;
  content: string;
  originalLink?: string;
  originalSource?: string;
  tags?: string[];
  status?: NewsStatus;
}

export interface UpdateNewsRequest {
  title?: string;
  summary?: string;
  content?: string;
  originalLink?: string;
  originalSource?: string;
  tags?: string[];
  status?: NewsStatus;
}

// AI types
export interface AIProcessRequest {
  title: string;
  content: string;
  originalSource?: string;
}

export interface AIProcessResponse {
  processedTitle: string;
  summary: string;
  tags: string[];
  commentary?: string;
  keywords: string[];
}

export interface AISummaryRequest {
  title: string;
  content?: string;
}

export interface AITagsRequest {
  title: string;
  content?: string;
}

// Media types
export interface GenerateImageRequest {
  title: string;
  description?: string;
  style?: string;
  format?: 'png' | 'jpeg' | 'webp';
  template?: string;
}

export interface GenerateImageResponse {
  success: boolean;
  url?: string;
  filename?: string;
  data?: string; // base64
  metadata?: {
    template: string;
    dimensions: {
      width: number;
      height: number;
    };
    format: string;
    size: number;
  };
}

// Provider types
export interface ExternalSource {
  id: string;
  name: string;
  type: SourceType;
  apiKey?: string;
  baseUrl?: string;
  isActive: boolean;
  config?: Record<string, any>;
  lastFetch?: string;
  createdAt: string;
  updatedAt: string;
}

export enum SourceType {
  NEWS_API = 'NEWS_API',
  RSS_FEED = 'RSS_FEED',
  WEB_SCRAPER = 'WEB_SCRAPER',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  GNEWS_API = 'GNEWS_API',
  NEWSAPI_ORG = 'NEWSAPI_ORG',
  REDDIT_API = 'REDDIT_API',
  TWITTER_API = 'TWITTER_API',
}

// Publication types
export interface Publication {
  id: string;
  newsId: string;
  platform: string;
  status: PublicationStatus;
  publishedAt?: string;
  url?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export enum PublicationStatus {
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  FAILED = 'FAILED',
}

// Queue types
export interface QueueStats {
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Search types
export interface SearchParams {
  q?: string;
  page?: number;
  limit?: number;
  tag?: string;
  status?: NewsStatus;
}

// Dashboard stats
export interface DashboardStats {
  totalNews: number;
  publishedNews: number;
  draftNews: number;
  totalPublications: number;
  successfulPublications: number;
  failedPublications: number;
  activeSources: number;
  queueStats: QueueStats[];
}
