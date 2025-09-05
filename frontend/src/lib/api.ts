import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getCookie, setCookie, removeCookie } from './cookies';
import {
  LoginRequest,
  LoginResponse,
  User,
  News,
  CreateNewsRequest,
  UpdateNewsRequest,
  PaginatedResponse,
  SearchParams,
  AIProcessRequest,
  AIProcessResponse,
  AISummaryRequest,
  AITagsRequest,
  GenerateImageRequest,
  GenerateImageResponse,
  ExternalSource,
  Publication,
  QueueStats,
  DashboardStats,
} from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
      timeout: 30000,
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = getCookie('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          removeCookie('auth_token');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.client.post('/auth/login', credentials);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<User> = await this.client.get('/auth/profile');
    return response.data;
  }

  async refreshToken(): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.client.post('/auth/refresh');
    return response.data;
  }

  // News endpoints
  async getNews(params?: SearchParams): Promise<PaginatedResponse<News>> {
    const response: AxiosResponse<PaginatedResponse<News>> = await this.client.get('/news', { params });
    return response.data;
  }

  async getPublishedNews(params?: SearchParams): Promise<PaginatedResponse<News>> {
    const response: AxiosResponse<PaginatedResponse<News>> = await this.client.get('/news/published', { params });
    return response.data;
  }

  async getNewsById(id: string): Promise<News> {
    const response: AxiosResponse<News> = await this.client.get(`/news/${id}`);
    return response.data;
  }

  async getNewsBySlug(slug: string): Promise<News> {
    const response: AxiosResponse<News> = await this.client.get(`/news/slug/${slug}`);
    return response.data;
  }

  async createNews(news: CreateNewsRequest): Promise<News> {
    const response: AxiosResponse<News> = await this.client.post('/news', news);
    return response.data;
  }

  async updateNews(id: string, news: UpdateNewsRequest): Promise<News> {
    const response: AxiosResponse<News> = await this.client.patch(`/news/${id}`, news);
    return response.data;
  }

  async deleteNews(id: string): Promise<void> {
    await this.client.delete(`/news/${id}`);
  }

  async searchNews(query: string, params?: SearchParams): Promise<PaginatedResponse<News>> {
    const response: AxiosResponse<PaginatedResponse<News>> = await this.client.get('/news/search', {
      params: { q: query, ...params },
    });
    return response.data;
  }

  async getNewsByTag(tag: string, params?: SearchParams): Promise<PaginatedResponse<News>> {
    const response: AxiosResponse<PaginatedResponse<News>> = await this.client.get(`/news/tag/${tag}`, { params });
    return response.data;
  }

  async getNewsByCategory(category: string, params?: SearchParams): Promise<PaginatedResponse<News>> {
    const response: AxiosResponse<PaginatedResponse<News>> = await this.client.get(`/news/category/${category}`, { params });
    return response.data;
  }

  async getCategoryStats(): Promise<{ category: string; count: number }[]> {
    const response: AxiosResponse<{ category: string; count: number }[]> = await this.client.get('/news/categories/stats');
    return response.data;
  }

  // AI endpoints
  async processNewsContent(data: AIProcessRequest): Promise<AIProcessResponse> {
    const response: AxiosResponse<AIProcessResponse> = await this.client.post('/ai/process', data);
    return response.data;
  }

  async generateSummary(data: AISummaryRequest): Promise<{ summary: string }> {
    const response: AxiosResponse<{ summary: string }> = await this.client.post('/ai/summary', data);
    return response.data;
  }

  async generateHeadline(data: AISummaryRequest): Promise<{ headline: string }> {
    const response: AxiosResponse<{ headline: string }> = await this.client.post('/ai/headline', data);
    return response.data;
  }

  async generateCommentary(data: AIProcessRequest): Promise<{ commentary: string }> {
    const response: AxiosResponse<{ commentary: string }> = await this.client.post('/ai/commentary', data);
    return response.data;
  }

  async generateTags(data: AITagsRequest): Promise<{ tags: string[] }> {
    const response: AxiosResponse<{ tags: string[] }> = await this.client.post('/ai/tags', data);
    return response.data;
  }

  async extractKeywords(data: { text: string }): Promise<{ keywords: string[] }> {
    const response: AxiosResponse<{ keywords: string[] }> = await this.client.post('/ai/keywords', data);
    return response.data;
  }

  // Media endpoints
  async generateImage(data: GenerateImageRequest): Promise<GenerateImageResponse> {
    const response: AxiosResponse<GenerateImageResponse> = await this.client.post('/media/generate', data);
    return response.data;
  }

  async generateBase64Image(data: GenerateImageRequest): Promise<{ success: boolean; data?: string; error?: string }> {
    const response: AxiosResponse<{ success: boolean; data?: string; error?: string }> = await this.client.post('/media/generate/base64', data);
    return response.data;
  }

  async generateSocialImage(platform: string, data: { title: string; subtitle?: string; category?: string }): Promise<GenerateImageResponse> {
    const response: AxiosResponse<GenerateImageResponse> = await this.client.post(`/media/generate/social/${platform}`, data);
    return response.data;
  }

  async getAvailableTemplates(): Promise<{ templates: string[]; count: number }> {
    const response: AxiosResponse<{ templates: string[]; count: number }> = await this.client.get('/media/templates');
    return response.data;
  }

  async deleteImage(path: string): Promise<{ success: boolean; message: string }> {
    const response: AxiosResponse<{ success: boolean; message: string }> = await this.client.delete('/media/image', { params: { path } });
    return response.data;
  }

  // Provider endpoints
  async getSources(): Promise<ExternalSource[]> {
    const response: AxiosResponse<ExternalSource[]> = await this.client.get('/providers/sources');
    return response.data;
  }

  async getActiveSources(): Promise<ExternalSource[]> {
    const response: AxiosResponse<ExternalSource[]> = await this.client.get('/providers/sources/active');
    return response.data;
  }

  async fetchNewsFromAllSources(): Promise<{ message: string; count: number; articles: unknown[] }> {
    const response: AxiosResponse<{ message: string; count: number; articles: unknown[] }> = await this.client.post('/providers/fetch');
    return response.data;
  }

  async fetchAndProcessNews(): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.client.post('/providers/fetch-and-save');
    return response.data;
  }

  async reprocessFailedNews(): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.client.post('/providers/reprocess-failed');
    return response.data;
  }

  async fetchNewsFromSource(sourceId: string): Promise<{ message: string; count: number; articles: unknown[] }> {
    const response: AxiosResponse<{ message: string; count: number; articles: unknown[] }> = await this.client.post(`/providers/fetch/${sourceId}`);
    return response.data;
  }

  async toggleSourceActive(sourceId: string): Promise<ExternalSource> {
    const response: AxiosResponse<ExternalSource> = await this.client.patch(`/providers/sources/${sourceId}/toggle`);
    return response.data;
  }

  async testSource(sourceId: string): Promise<{ message: string; count: number; articles: unknown[] }> {
    const response: AxiosResponse<{ message: string; count: number; articles: unknown[] }> = await this.client.post(`/providers/test/${sourceId}`);
    return response.data;
  }

  async testRSSFeeds(category?: string): Promise<{ message: string; count: number; articles: unknown[] }> {
    const response: AxiosResponse<{ message: string; count: number; articles: unknown[] }> = await this.client.post('/providers/test/rss', { category });
    return response.data;
  }

  async testNewsAPI(category?: string): Promise<{ message: string; count: number; articles: unknown[] }> {
    const response: AxiosResponse<{ message: string; count: number; articles: unknown[] }> = await this.client.post('/providers/test/newsapi', { category });
    return response.data;
  }

  async testAllSources(): Promise<{ message: string; results: Record<string, any> }> {
    const response: AxiosResponse<{ message: string; results: Record<string, any> }> = await this.client.post('/providers/test/all');
    return response.data;
  }

  // Publication endpoints
  async publishToSocial(newsId: string, platform: string): Promise<Publication> {
    const response: AxiosResponse<Publication> = await this.client.post(`/publication/publish/${newsId}/${platform}`);
    return response.data;
  }

  async getPublications(newsId?: string): Promise<Publication[]> {
    const response: AxiosResponse<Publication[]> = await this.client.get('/publication', { params: { newsId } });
    return response.data;
  }

  async getPublicationStats(): Promise<unknown> {
    const response: AxiosResponse<unknown> = await this.client.get('/publication/stats');
    return response.data;
  }

  async retryPublication(publicationId: string): Promise<Publication> {
    const response: AxiosResponse<Publication> = await this.client.post(`/publication/retry/${publicationId}`);
    return response.data;
  }

  // Queue endpoints
  async getQueueStats(): Promise<QueueStats[]> {
    const response: AxiosResponse<QueueStats[]> = await this.client.get('/queue/stats');
    return response.data;
  }

  async pauseQueue(queueName: string): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.client.post(`/queue/pause/${queueName}`);
    return response.data;
  }

  async resumeQueue(queueName: string): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.client.post(`/queue/resume/${queueName}`);
    return response.data;
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<DashboardStats> {
    // This would be a custom endpoint that aggregates data from multiple sources
    // For now, we'll make multiple calls and combine the data
    const [newsResponse, publicationsResponse, sourcesResponse, queueResponse] = await Promise.all([
      this.client.get('/news'),
      this.client.get('/publication/stats'),
      this.client.get('/providers/sources/active'),
      this.client.get('/queue/stats'),
    ]);

    const news = newsResponse.data;
    const publications = publicationsResponse.data;
    const sources = sourcesResponse.data;
    const queueStats = queueResponse.data;

    return {
      totalNews: news.meta?.total || 0,
      publishedNews: news.data?.filter((n: News) => n.status === 'PUBLISHED').length || 0,
      draftNews: news.data?.filter((n: News) => n.status === 'DRAFT').length || 0,
      totalPublications: (publications as { total?: number })?.total || 0,
      successfulPublications: (publications as { successful?: number })?.successful || 0,
      failedPublications: (publications as { failed?: number })?.failed || 0,
      activeSources: sources.length || 0,
      queueStats: Array.isArray(queueStats) ? queueStats : [],
    };
  }

  // View tracking
  async incrementNewsViews(newsId: string): Promise<{ views: number }> {
    const response: AxiosResponse<{ views: number }> = await this.client.post(`/news/${newsId}/view`);
    return response.data;
  }

  async getPopularNews(limit: number = 10): Promise<News[]> {
    const response: AxiosResponse<News[]> = await this.client.get(`/news/popular?limit=${limit}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
