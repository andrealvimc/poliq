import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class ProcessNewsDto {
  @ApiProperty({
    description: 'News title',
    example: 'Breaking: New technology announced',
    maxLength: 200,
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(200, { message: 'Title must be at most 200 characters long' })
  title: string;

  @ApiPropertyOptional({
    description: 'News content',
    example: 'Full article content...',
  })
  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  content?: string;

  @ApiPropertyOptional({
    description: 'Original source name',
    example: 'Tech News Portal',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Original source must be a string' })
  @MaxLength(100, { message: 'Original source must be at most 100 characters long' })
  originalSource?: string;
}
