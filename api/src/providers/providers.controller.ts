import { Controller, Get, Post, Param, UseGuards, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { ProvidersService } from './providers.service';
import { ExternalSourceService } from './services/external-source.service';
import { NewsSchedulerService } from '../scheduler/services/news-scheduler.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('providers')
@Controller('providers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProvidersController {
  constructor(
    private readonly providersService: ProvidersService,
    private readonly externalSourceService: ExternalSourceService,
    private readonly newsSchedulerService: NewsSchedulerService,
  ) {}

  @Get('sources')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'List all external sources' })
  @ApiResponse({ status: 200, description: 'List of external sources' })
  findAllSources() {
    return this.externalSourceService.findAll();
  }

  @Get('sources/active')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'List active external sources' })
  @ApiResponse({ status: 200, description: 'List of active external sources' })
  findActiveSources() {
    return this.externalSourceService.findActive();
  }

  @Post('fetch')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Fetch news from all active sources' })
  @ApiResponse({ status: 200, description: 'News fetched successfully' })
  async fetchNewsFromAllSources() {
    const results = await this.providersService.fetchNewsFromAllSources();
    return {
      message: 'News fetched successfully',
      count: results.length,
      articles: results,
    };
  }

  @Post('fetch-and-save')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Fetch news and save to database with processing queue' })
  @ApiResponse({ status: 200, description: 'News fetched and saved successfully' })
  async fetchAndProcessNews() {
    await this.newsSchedulerService.fetchAndProcessNews();
    return {
      message: 'News fetched, saved, and queued for processing successfully',
    };
  }

  @Post('reprocess-failed')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Reprocess news that failed AI processing' })
  @ApiResponse({ status: 200, description: 'Failed news requeued for processing' })
  async reprocessFailedNews() {
    await this.newsSchedulerService.processUnprocessedNews();
    return {
      message: 'Failed news items requeued for processing successfully',
    };
  }

  @Post('fetch/:sourceId')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Fetch news from specific source' })
  @ApiResponse({ status: 200, description: 'News fetched successfully' })
  @ApiResponse({ status: 404, description: 'Source not found' })
  async fetchNewsFromSource(@Param('sourceId') sourceId: string) {
    const results = await this.providersService.fetchNewsFromSource(sourceId);
    return {
      message: 'News fetched successfully',
      count: results.length,
      articles: results,
    };
  }

  @Patch('sources/:id/toggle')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Toggle external source active status' })
  @ApiResponse({ status: 200, description: 'Source status updated' })
  @ApiResponse({ status: 404, description: 'Source not found' })
  toggleSourceActive(@Param('id') id: string) {
    return this.externalSourceService.toggleActive(id);
  }
}
