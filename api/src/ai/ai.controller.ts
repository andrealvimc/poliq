import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AiService } from './ai.service';
import { ProcessNewsDto } from './dto/process-news.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('ai')
@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('process')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Process news content with AI' })
  @ApiResponse({ status: 200, description: 'Content processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async processNewsContent(@Body() processNewsDto: ProcessNewsDto) {
    return this.aiService.processNewsContent(
      processNewsDto.title,
      processNewsDto.content,
      processNewsDto.originalSource,
    );
  }

  @Post('summary')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Generate AI summary' })
  @ApiResponse({ status: 200, description: 'Summary generated successfully' })
  async generateSummary(@Body() body: { title: string; content?: string }) {
    const summary = await this.aiService.generateSummary(body.title, body.content);
    return { summary };
  }

  @Post('headline')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Generate AI headline' })
  @ApiResponse({ status: 200, description: 'Headline generated successfully' })
  async generateHeadline(@Body() body: { title: string; content?: string }) {
    const headline = await this.aiService.generateHeadline(body.title, body.content);
    return { headline };
  }

  @Post('commentary')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Generate AI commentary' })
  @ApiResponse({ status: 200, description: 'Commentary generated successfully' })
  async generateCommentary(@Body() body: { title: string; content?: string; source?: string }) {
    const commentary = await this.aiService.generateCommentary(
      body.title, 
      body.content, 
      body.source
    );
    return { commentary };
  }

  @Post('tags')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Generate AI tags' })
  @ApiResponse({ status: 200, description: 'Tags generated successfully' })
  async generateTags(@Body() body: { title: string; content?: string }) {
    const tags = await this.aiService.generateTags(body.title, body.content);
    return { tags };
  }

  @Post('keywords')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Extract keywords from text' })
  @ApiResponse({ status: 200, description: 'Keywords extracted successfully' })
  async extractKeywords(@Body() body: { text: string }) {
    const keywords = await this.aiService.extractKeywords(body.text);
    return { keywords };
  }
}
