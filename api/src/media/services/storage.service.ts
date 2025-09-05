import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface StorageResult {
  url: string;
  path: string;
  filename: string;
}

export interface StorageProvider {
  save(buffer: Buffer, filename: string, metadata?: any): Promise<StorageResult>;
  delete(path: string): Promise<boolean>;
  getUrl(path: string): string;
}

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  private readonly logger = new Logger(LocalStorageProvider.name);
  private readonly uploadsDir: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadsDir = join(process.cwd(), 'uploads', 'media');
    this.baseUrl = this.configService.get('app.baseUrl') || 'http://localhost:3000';
    this.ensureUploadsDirectory();
  }

  async save(buffer: Buffer, filename: string, metadata?: any): Promise<StorageResult> {
    try {
      const uniqueFilename = `${uuidv4()}-${filename}`;
      const filePath = join(this.uploadsDir, uniqueFilename);

      await fs.writeFile(filePath, buffer);

      const result: StorageResult = {
        url: `${this.baseUrl}/uploads/media/${uniqueFilename}`,
        path: filePath,
        filename: uniqueFilename,
      };

      this.logger.log(`File saved locally: ${uniqueFilename}`);
      return result;

    } catch (error) {
      this.logger.error('Failed to save file locally:', error.message);
      throw new Error(`Local storage save failed: ${error.message}`);
    }
  }

  async delete(path: string): Promise<boolean> {
    try {
      await fs.unlink(path);
      this.logger.log(`File deleted: ${path}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete file: ${path}`, error.message);
      return false;
    }
  }

  getUrl(path: string): string {
    const filename = path.split('/').pop();
    return `${this.baseUrl}/uploads/media/${filename}`;
  }

  private async ensureUploadsDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadsDir);
    } catch {
      await fs.mkdir(this.uploadsDir, { recursive: true });
      this.logger.log(`Created uploads directory: ${this.uploadsDir}`);
    }
  }
}

// Future S3 Storage Provider (placeholder)
@Injectable()
export class S3StorageProvider implements StorageProvider {
  private readonly logger = new Logger(S3StorageProvider.name);

  constructor(private configService: ConfigService) {
    // Initialize S3 client here
  }

  async save(buffer: Buffer, filename: string, metadata?: any): Promise<StorageResult> {
    // TODO: Implement S3 upload
    throw new Error('S3 storage not implemented yet');
  }

  async delete(path: string): Promise<boolean> {
    // TODO: Implement S3 delete
    throw new Error('S3 storage not implemented yet');
  }

  getUrl(path: string): string {
    // TODO: Return S3 URL
    throw new Error('S3 storage not implemented yet');
  }
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly provider: StorageProvider;

  constructor(
    private configService: ConfigService,
    private localStorageProvider: LocalStorageProvider,
    // private s3StorageProvider: S3StorageProvider, // Uncomment when implementing S3
  ) {
    const storageType = this.configService.get('storage.type') || 'local';
    
    switch (storageType) {
      case 's3':
        // this.provider = this.s3StorageProvider; // Uncomment when implementing S3
        this.logger.warn('S3 storage not implemented, falling back to local storage');
        this.provider = this.localStorageProvider;
        break;
      case 'local':
      default:
        this.provider = this.localStorageProvider;
        break;
    }

    this.logger.log(`Using storage provider: ${storageType}`);
  }

  async saveImage(
    buffer: Buffer,
    filename: string,
    metadata?: {
      template?: string;
      title?: string;
      format?: string;
    },
  ): Promise<StorageResult> {
    return this.provider.save(buffer, filename, metadata);
  }

  async deleteImage(path: string): Promise<boolean> {
    return this.provider.delete(path);
  }

  getImageUrl(path: string): string {
    return this.provider.getUrl(path);
  }

  async saveBase64Image(
    base64Data: string,
    filename: string,
    metadata?: any,
  ): Promise<StorageResult> {
    const buffer = Buffer.from(base64Data, 'base64');
    return this.saveImage(buffer, filename, metadata);
  }

  generateFilename(template: string, format: string = 'png'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${template}-${timestamp}-${random}.${format}`;
  }
}
