import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  
  // CORS
  const corsOrigin = configService.get('CORS_ORIGIN') || 
    (process.env.NODE_ENV === 'production' ? false : true);
  
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  const apiPrefix = configService.get('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Swagger documentation
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Poliq API')
      .setDescription('API modular para o projeto Poliq - Portal de Notícias')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Autenticação e autorização')
      .addTag('news', 'Gerenciamento de notícias')
      .addTag('providers', 'Provedores de conteúdo externos')
      .addTag('ai', 'Serviços de inteligência artificial')
      .addTag('media', 'Geração e manipulação de mídia')
      .addTag('publication', 'Publicação em redes sociais')
      .addTag('queue', 'Gerenciamento de filas')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
      customSiteTitle: 'Poliq API Documentation',
      customCss: '.swagger-ui .topbar { display: none }',
    });
  }

  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  
  console.log(`🚀 Poliq API running on: http://localhost:${port}/${apiPrefix}`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📚 API Documentation: http://localhost:${port}/${apiPrefix}/docs`);
  }
}

bootstrap();
