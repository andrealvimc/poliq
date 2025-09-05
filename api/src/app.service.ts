import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: '🚀 Poliq API is running!',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  getHealth(): object {
    return {
      status: 'ok',
      service: 'poliq-api',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
