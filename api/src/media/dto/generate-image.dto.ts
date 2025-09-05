import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, MaxLength, IsUrl } from 'class-validator';

export class GenerateImageDto {
  @ApiProperty({
    description: 'Main title text for the image',
    example: 'Breaking News: New Technology Announced',
    maxLength: 100,
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(100, { message: 'Title must be at most 100 characters long' })
  title: string;

  @ApiPropertyOptional({
    description: 'Subtitle or description text',
    example: 'Revolutionary AI technology changes the market forever',
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'Subtitle must be a string' })
  @MaxLength(200, { message: 'Subtitle must be at most 200 characters long' })
  subtitle?: string;

  @ApiPropertyOptional({
    description: 'Category/tag for the content',
    example: 'TECHNOLOGY',
    maxLength: 30,
  })
  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  @MaxLength(30, { message: 'Category must be at most 30 characters long' })
  category?: string;

  @ApiProperty({
    description: 'Template name to use for image generation',
    example: 'infomoney',
    enum: ['infomoney', 'default'],
    default: 'infomoney',
  })
  @IsString({ message: 'Template must be a string' })
  @IsNotEmpty({ message: 'Template is required' })
  @IsEnum(['infomoney', 'default'], { message: 'Template must be a valid template name' })
  template: string;

  @ApiPropertyOptional({
    description: 'Optional background image URL',
    example: 'https://example.com/background.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Background image must be a valid URL' })
  backgroundImage?: string;

  @ApiPropertyOptional({
    description: 'Output format for the generated image',
    enum: ['png', 'jpeg', 'webp', 'svg'],
    default: 'png',
  })
  @IsOptional()
  @IsEnum(['png', 'jpeg', 'webp', 'svg'], { message: 'Format must be png, jpeg, webp, or svg' })
  format?: 'png' | 'jpeg' | 'webp' | 'svg' = 'png';

  @ApiPropertyOptional({
    description: 'Image quality (1-100, only for jpeg)',
    example: 90,
  })
  @IsOptional()
  quality?: number = 90;
}
