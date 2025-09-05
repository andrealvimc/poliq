import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { ProvidersModule } from './providers/providers.module';
import { AiModule } from './ai/ai.module';
import { MediaModule } from './media/media.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { QueueModule } from './queue/queue.module';
import { PublicationModule } from './publication/publication.module';
import { CommonModule } from './common/common.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Configuration (using custom ConfigModule with all configs loaded)
    ConfigModule,

    // Scheduler
    ScheduleModule.forRoot(),

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.THROTTLE_TTL) || 60000,
      limit: parseInt(process.env.THROTTLE_LIMIT) || 100,
    }]),

    // Bull Queue
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),

    // Static file serving
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    // HTTP client
    HttpModule,

    // Core modules
    CommonModule,
    DatabaseModule,
    
    // Feature modules
    AuthModule,
    NewsModule,
    ProvidersModule,
    AiModule,
    MediaModule,
    SchedulerModule,
    QueueModule,
    PublicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
