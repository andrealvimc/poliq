import { 
  Controller, 
  Post, 
  Get, 
  Delete,
  Body, 
  Param, 
  Query,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Response } from 'express';

import { MediaService } from './media.service';
import { GenerateImageDto } from './dto/generate-image.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate image from template' })
  @ApiResponse({ 
    status: 201, 
    description: 'Image generated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        url: { type: 'string' },
        filename: { type: 'string' },
        metadata: {
          type: 'object',
          properties: {
            template: { type: 'string' },
            dimensions: {
              type: 'object',
              properties: {
                width: { type: 'number' },
                height: { type: 'number' },
              },
            },
            format: { type: 'string' },
            size: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async generateImage(@Body() generateImageDto: GenerateImageDto) {
    return this.mediaService.generateImage(generateImageDto);
  }

  @Post('generate/base64')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate image and return as base64' })
  @ApiResponse({ 
    status: 201, 
    description: 'Image generated successfully as base64',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { type: 'string', description: 'Base64 encoded image data' },
      },
    },
  })
  async generateBase64Image(@Body() generateImageDto: GenerateImageDto) {
    try {
      const base64Data = await this.mediaService.generateBase64Image(generateImageDto);
      return {
        success: true,
        data: base64Data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('generate/buffer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate image and return as binary buffer' })
  @ApiResponse({ 
    status: 201, 
    description: 'Image generated successfully',
    content: {
      'image/png': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
      'image/jpeg': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
      'image/webp': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async generateImageBuffer(
    @Body() generateImageDto: GenerateImageDto,
    @Res() res: Response,
  ) {
    try {
      const buffer = await this.mediaService.generateImageBuffer(generateImageDto);
      const format = generateImageDto.format || 'png';
      const mimeType = this.getMimeType(format);

      res.set({
        'Content-Type': mimeType,
        'Content-Length': buffer.length.toString(),
        'Content-Disposition': `inline; filename="generated-image.${format}"`,
      });

      res.status(HttpStatus.CREATED).send(buffer);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error.message,
      });
    }
  }

  @Post('generate/social/:platform')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate optimized image for social media platform' })
  @ApiParam({ 
    name: 'platform', 
    enum: ['instagram', 'facebook', 'twitter'],
    description: 'Social media platform to optimize for',
  })
  @ApiResponse({ status: 201, description: 'Social media image generated successfully' })
  async generateSocialImage(
    @Param('platform') platform: 'instagram' | 'facebook' | 'twitter',
    @Body() body: { 
      title: string; 
      subtitle?: string; 
      category?: string;
    },
  ) {
    return this.mediaService.generateSocialMediaImage(
      body.title,
      body.subtitle,
      body.category,
      platform,
    );
  }

  @Post('generate/variants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate multiple image variants (different formats/qualities)' })
  @ApiResponse({ status: 201, description: 'Image variants generated successfully' })
  async generateImageVariants(
    @Body() body: {
      imageData: GenerateImageDto;
      variants: Array<{ format: string; quality?: number; suffix?: string }>;
    },
  ) {
    return this.mediaService.generateImageVariants(body.imageData, body.variants);
  }

  @Get('templates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get available templates' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of available templates',
    schema: {
      type: 'object',
      properties: {
        templates: {
          type: 'array',
          items: { type: 'string' },
        },
        count: { type: 'number' },
      },
    },
  })
  async getAvailableTemplates() {
    return this.mediaService.getAvailableTemplates();
  }

  @Get('templates/:name')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get template details' })
  @ApiParam({ name: 'name', description: 'Template name' })
  @ApiResponse({ status: 200, description: 'Template details' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async getTemplateDetails(@Param('name') name: string) {
    return this.mediaService.getTemplateDetails(name);
  }

  @Post('templates/reload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reload template cache' })
  @ApiResponse({ status: 200, description: 'Templates reloaded successfully' })
  async reloadTemplates() {
    await this.mediaService.reloadTemplates();
    return {
      success: true,
      message: 'Templates reloaded successfully',
    };
  }

  @Delete('image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete generated image' })
  @ApiQuery({ name: 'path', description: 'Image file path' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async deleteImage(@Query('path') path: string) {
    const deleted = await this.mediaService.deleteImage(path);
    return {
      success: deleted,
      message: deleted ? 'Image deleted successfully' : 'Failed to delete image',
    };
  }

  // Public endpoint for serving generated images (if using local storage)
  @Get('preview')
  @ApiOperation({ summary: 'Preview generated image' })
  @ApiQuery({ name: 'url', description: 'Image URL' })
  @ApiResponse({ status: 200, description: 'Image preview' })
  async previewImage(@Query('url') url: string, @Res() res: Response) {
    // This would redirect to the actual image URL or serve it directly
    // Implementation depends on your storage setup
    res.redirect(url);
  }

  private getMimeType(format: string): string {
    switch (format) {
      case 'jpeg':
      case 'jpg':
        return 'image/jpeg';
      case 'webp':
        return 'image/webp';
      case 'png':
      default:
        return 'image/png';
    }
  }
}
