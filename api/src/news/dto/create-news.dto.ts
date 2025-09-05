import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
  IsUrl,
  IsBoolean,
  IsDateString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NewsStatus } from '@prisma/client';

export class CreateNewsDto {
  @ApiProperty({
    description: 'News title',
    example: 'New technology revolutionizes the market',
    minLength: 10,
    maxLength: 200,
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(10, { message: 'Title must be at least 10 characters long' })
  @MaxLength(200, { message: 'Title must be at most 200 characters long' })
  title: string;

  @ApiPropertyOptional({
    description: 'News summary',
    example: 'A concise summary about the new technology...',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Summary must be a string' })
  @MaxLength(500, { message: 'Summary must be at most 500 characters long' })
  summary?: string;

  @ApiPropertyOptional({
    description: 'Full news content',
    example: 'Detailed news content...',
  })
  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  content?: string;

  @ApiPropertyOptional({
    description: 'Original source link',
    example: 'https://example.com/original-news',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Original link must be a valid URL' })
  originalLink?: string;

  @ApiPropertyOptional({
    description: 'Original source name',
    example: 'News Portal',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Original source must be a string' })
  @MaxLength(100, { message: 'Original source must be at most 100 characters long' })
  originalSource?: string;

  @ApiPropertyOptional({
    description: 'News image URL',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be valid' })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Indicates if the image was AI generated',
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'imageGenerated field must be true or false' })
  imageGenerated?: boolean = false;

  @ApiPropertyOptional({
    description: 'News tags',
    example: ['technology', 'innovation', 'market'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[] = [];

  @ApiPropertyOptional({
    description: 'Publication date',
    example: '2024-01-15T10:30:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Published date must be a valid date' })
  publishedAt?: string;

  @ApiPropertyOptional({
    description: 'News status',
    enum: NewsStatus,
    default: NewsStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(NewsStatus, { message: 'Status must be a valid value' })
  status?: NewsStatus = NewsStatus.DRAFT;

  @ApiPropertyOptional({
    description: 'AI generated summary',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: 'AI summary must be a string' })
  @MaxLength(1000, { message: 'AI summary must be at most 1000 characters long' })
  aiSummary?: string;

  @ApiPropertyOptional({
    description: 'AI generated headline',
    maxLength: 150,
  })
  @IsOptional()
  @IsString({ message: 'AI headline must be a string' })
  @MaxLength(150, { message: 'AI headline must be at most 150 characters long' })
  aiHeadline?: string;

  @ApiPropertyOptional({
    description: 'AI generated commentary/analysis',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString({ message: 'AI commentary must be a string' })
  @MaxLength(2000, { message: 'AI commentary must be at most 2000 characters long' })
  aiCommentary?: string;

  @ApiPropertyOptional({
    description: 'Indicates if it was processed by AI',
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'aiProcessed field must be true or false' })
  aiProcessed?: boolean = false;
}
