import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'User email address',
    example: 'user@poliq.com' 
  })
  @IsEmail({}, { message: 'Email must be a valid format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ 
    description: 'User password',
    example: 'password123',
    minLength: 6 
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ 
    description: 'User full name',
    example: 'John Doe' 
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiPropertyOptional({ 
    description: 'User role in the system',
    enum: UserRole,
    default: UserRole.ADMIN 
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be a valid value' })
  role?: UserRole = UserRole.ADMIN;

  @ApiPropertyOptional({ 
    description: 'User active status',
    default: true 
  })
  @IsOptional()
  @IsBoolean({ message: 'Active status must be true or false' })
  isActive?: boolean = true;
}
