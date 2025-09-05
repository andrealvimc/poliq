import { Injectable, NotFoundException } from '@nestjs/common';
import { ExternalSource } from '@prisma/client';

import { DatabaseService } from '../../database/database.service';

@Injectable()
export class ExternalSourceService {
  constructor(private database: DatabaseService) {}

  async findAll(): Promise<ExternalSource[]> {
    return this.database.externalSource.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findActive(): Promise<ExternalSource[]> {
    return this.database.externalSource.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<ExternalSource> {
    const source = await this.database.externalSource.findUnique({
      where: { id },
    });

    if (!source) {
      throw new NotFoundException('External source not found');
    }

    return source;
  }

  async findByName(name: string): Promise<ExternalSource> {
    const source = await this.database.externalSource.findUnique({
      where: { name },
    });

    if (!source) {
      throw new NotFoundException('External source not found');
    }

    return source;
  }

  async updateLastFetch(id: string): Promise<ExternalSource> {
    return this.database.externalSource.update({
      where: { id },
      data: { lastFetch: new Date() },
    });
  }

  async toggleActive(id: string): Promise<ExternalSource> {
    const source = await this.findById(id);
    
    return this.database.externalSource.update({
      where: { id },
      data: { isActive: !source.isActive },
    });
  }
}
