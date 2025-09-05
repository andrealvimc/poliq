import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PublicationPlatform, PublicationStatus } from '@prisma/client';

import { DatabaseService } from '../database/database.service';
import { SocialMediaService } from './services/social-media.service';
import { MediaService } from '../media/media.service';

@Injectable()
export class PublicationService {
  private readonly logger = new Logger(PublicationService.name);

  constructor(
    private database: DatabaseService,
    private socialMediaService: SocialMediaService,
    private mediaService: MediaService,
  ) {}

  async publishToSocialMedia(
    newsId: string,
    platform: string,
  ): Promise<{ success: boolean; postId?: string; error?: string }> {
    this.logger.log(`Publishing news ${newsId} to ${platform}`);

    try {
      // Get news data
      const news = await this.database.news.findUnique({
        where: { id: newsId },
      });

      if (!news) {
        throw new NotFoundException('News not found');
      }

      // Create publication record
      const publication = await this.database.publication.create({
        data: {
          newsId,
          platform: platform.toUpperCase() as PublicationPlatform,
          status: PublicationStatus.PROCESSING,
        },
      });

      try {
        // Generate image for social media
        const imageResult = await this.mediaService.generateSocialMediaImage(
          news.title,
          news.summary,
          news.tags[0]?.toUpperCase(),
          platform as any,
        );

        if (!imageResult.success) {
          throw new Error(`Failed to generate image: ${imageResult.error}`);
        }

        // Prepare social media content
        const caption = this.generateCaption(news.title, platform);
        const hashtags = this.generateHashtags(news.tags, platform);

        // Publish based on platform
        let postId: string | null = null;

        switch (platform.toLowerCase()) {
          case 'instagram':
            postId = await this.socialMediaService.publishToInstagram(
              caption,
              imageResult.url,
              hashtags,
            );
            break;
          case 'facebook':
            postId = await this.socialMediaService.publishToFacebook(
              caption,
              imageResult.url,
            );
            break;
          case 'twitter':
            postId = await this.socialMediaService.publishToTwitter(
              caption,
              imageResult.url,
            );
            break;
          default:
            throw new Error(`Unsupported platform: ${platform}`);
        }

        // Update publication record
        await this.database.publication.update({
          where: { id: publication.id },
          data: {
            status: PublicationStatus.PUBLISHED,
            postId,
            publishedAt: new Date(),
            metadata: {
              caption,
              hashtags,
              imageUrl: imageResult.url,
              platform,
            },
          },
        });

        this.logger.log(`Successfully published news ${newsId} to ${platform}`);
        return { success: true, postId };

      } catch (error) {
        // Update publication record with error
        await this.database.publication.update({
          where: { id: publication.id },
          data: {
            status: PublicationStatus.FAILED,
            errorMsg: error.message,
          },
        });

        throw error;
      }

    } catch (error) {
      this.logger.error(`Failed to publish news ${newsId} to ${platform}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async getPublications(newsId?: string) {
    return this.database.publication.findMany({
      where: newsId ? { newsId } : {},
      include: {
        news: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPublicationStats() {
    const [total, published, failed, byPlatform] = await Promise.all([
      this.database.publication.count(),
      this.database.publication.count({
        where: { status: PublicationStatus.PUBLISHED },
      }),
      this.database.publication.count({
        where: { status: PublicationStatus.FAILED },
      }),
      this.database.publication.groupBy({
        by: ['platform'],
        _count: { platform: true },
      }),
    ]);

    return {
      total,
      published,
      failed,
      pending: total - published - failed,
      byPlatform: byPlatform.reduce((acc, item) => {
        acc[item.platform] = item._count.platform;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  async retryPublication(publicationId: string) {
    const publication = await this.database.publication.findUnique({
      where: { id: publicationId },
      include: { news: true },
    });

    if (!publication) {
      throw new NotFoundException('Publication not found');
    }

    // Reset status and retry
    await this.database.publication.update({
      where: { id: publicationId },
      data: {
        status: PublicationStatus.PENDING,
        errorMsg: null,
      },
    });

    return this.publishToSocialMedia(
      publication.newsId,
      publication.platform.toLowerCase(),
    );
  }

  private generateCaption(title: string, platform: string): string {
    const maxLength = platform === 'twitter' ? 200 : 500;
    
    let caption = `📰 ${title}`;
    
    if (caption.length > maxLength) {
      caption = caption.substring(0, maxLength - 3) + '...';
    }
    
    return caption;
  }

  private generateHashtags(tags: string[] = [], platform: string): string[] {
    const maxHashtags = platform === 'twitter' ? 3 : 10;
    
    // Start with default hashtags
    const hashtags = ['#poliq', '#noticias', '#brasil'];
    
    // Add relevant hashtags based on tags
    const keywordMap: Record<string, string> = {
      'tecnologia': '#tecnologia',
      'política': '#politica',
      'economia': '#economia',
      'esporte': '#esportes',
      'saúde': '#saude',
      'educação': '#educacao',
    };
    
    tags.forEach(tag => {
      const normalizedTag = tag.toLowerCase();
      if (keywordMap[normalizedTag] && !hashtags.includes(keywordMap[normalizedTag])) {
        hashtags.push(keywordMap[normalizedTag]);
      }
    });
    
    return hashtags.slice(0, maxHashtags);
  }
}
