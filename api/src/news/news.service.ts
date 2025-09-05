import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { News, NewsStatus } from '@prisma/client';

import { DatabaseService } from '../database/database.service';
import { SlugService } from '../common/services/slug.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PaginationDto, PaginationResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class NewsService {
  constructor(
    private database: DatabaseService,
    private slugService: SlugService,
  ) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    // Generate slug from title
    const existingSlugs = await this.database.news.findMany({
      select: { slug: true },
    });
    
    const slug = this.slugService.generateUniqueSlug(
      createNewsDto.title,
      existingSlugs.map(n => n.slug)
    );

    // Check if slug already exists (extra safety)
    const existingNews = await this.database.news.findUnique({
      where: { slug },
    });

    if (existingNews) {
      throw new ConflictException('Slug já existe');
    }

    const news = await this.database.news.create({
      data: {
        ...createNewsDto,
        slug,
        publishedAt: createNewsDto.status === NewsStatus.PUBLISHED 
          ? new Date() 
          : null,
      },
    });

    return news;
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginationResponseDto<News>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      this.database.news.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.database.news.count(),
    ]);

    return new PaginationResponseDto(news, total, page, limit);
  }

  async findAllPublished(paginationDto: PaginationDto): Promise<PaginationResponseDto<News>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      this.database.news.findMany({
        where: { 
          status: NewsStatus.PUBLISHED,
          publishedAt: { not: null },
        },
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      this.database.news.count({
        where: { 
          status: NewsStatus.PUBLISHED,
          publishedAt: { not: null },
        },
      }),
    ]);

    return new PaginationResponseDto(news, total, page, limit);
  }

  async findOne(id: string): Promise<News> {
    const news = await this.database.news.findUnique({
      where: { id },
      include: {
        publications: true,
        queueJobs: true,
      },
    });

    if (!news) {
      throw new NotFoundException('Notícia não encontrada');
    }

    return news;
  }

  async findBySlug(slug: string): Promise<News> {
    const news = await this.database.news.findUnique({
      where: { slug },
    });

    if (!news) {
      throw new NotFoundException('Notícia não encontrada');
    }

    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    const existingNews = await this.findOne(id);

    const updateData: any = { ...updateNewsDto };

    // If title changed, regenerate slug
    if (updateNewsDto.title && updateNewsDto.title !== existingNews.title) {
      const existingSlugs = await this.database.news.findMany({
        where: { id: { not: id } },
        select: { slug: true },
      });

      updateData.slug = this.slugService.generateUniqueSlug(
        updateNewsDto.title,
        existingSlugs.map(n => n.slug)
      );
    }

    // Update publishedAt if status changed to PUBLISHED
    if (updateNewsDto.status === NewsStatus.PUBLISHED && existingNews.status !== NewsStatus.PUBLISHED) {
      updateData.publishedAt = new Date();
    }

    // Clear publishedAt if status changed from PUBLISHED
    if (updateNewsDto.status && updateNewsDto.status !== NewsStatus.PUBLISHED && existingNews.status === NewsStatus.PUBLISHED) {
      updateData.publishedAt = null;
    }

    const news = await this.database.news.update({
      where: { id },
      data: updateData,
    });

    return news;
  }

  async remove(id: string): Promise<void> {
    const news = await this.findOne(id);

    await this.database.news.delete({
      where: { id },
    });
  }

  async findByTag(tag: string, paginationDto: PaginationDto): Promise<PaginationResponseDto<News>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      this.database.news.findMany({
        where: {
          tags: { has: tag },
          status: NewsStatus.PUBLISHED,
        },
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      this.database.news.count({
        where: {
          tags: { has: tag },
          status: NewsStatus.PUBLISHED,
        },
      }),
    ]);

    return new PaginationResponseDto(news, total, page, limit);
  }

  async search(query: string, paginationDto: PaginationDto): Promise<PaginationResponseDto<News>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      this.database.news.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { summary: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
          status: NewsStatus.PUBLISHED,
        },
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      this.database.news.count({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { summary: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
          status: NewsStatus.PUBLISHED,
        },
      }),
    ]);

    return new PaginationResponseDto(news, total, page, limit);
  }
}
