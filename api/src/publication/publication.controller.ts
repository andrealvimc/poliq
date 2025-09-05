import { Controller, Post, Get, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { PublicationService } from './publication.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('publication')
@Controller('publication')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post('publish/:newsId/:platform')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Publish news to social media platform' })
  @ApiResponse({ status: 200, description: 'News published successfully' })
  @ApiResponse({ status: 404, description: 'News not found' })
  async publishToSocial(
    @Param('newsId') newsId: string,
    @Param('platform') platform: string,
  ) {
    return this.publicationService.publishToSocialMedia(newsId, platform);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get all publications' })
  @ApiResponse({ status: 200, description: 'List of publications' })
  @ApiQuery({ name: 'newsId', required: false, type: String })
  async getPublications(@Query('newsId') newsId?: string) {
    return this.publicationService.getPublications(newsId);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get publication statistics' })
  @ApiResponse({ status: 200, description: 'Publication statistics' })
  async getStats() {
    return this.publicationService.getPublicationStats();
  }

  @Post('retry/:publicationId')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Retry failed publication' })
  @ApiResponse({ status: 200, description: 'Publication retried successfully' })
  @ApiResponse({ status: 404, description: 'Publication not found' })
  async retryPublication(@Param('publicationId') publicationId: string) {
    return this.publicationService.retryPublication(publicationId);
  }
}
