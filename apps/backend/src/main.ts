import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable Global Prefix
  app.setGlobalPrefix('api/v1');

  // 2. Security Headers & Protection
  app.use(helmet());
  
  // 3. CORS Configuration
  app.enableCors({
    origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 4. Response Compression
  app.use(compression());

  // 5. Global Filters & Interceptors
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // 6. Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 7. Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Yuva Sena Digital Platform API')
    .setDescription('Production-ready backend services for membership registration, events, complaints, and leaders portal.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 8. Port Binding
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`[Yuva Sena API Backend] running on: http://localhost:${port}/api/v1`);
  console.log(`[OpenAPI Documentation] running on: http://localhost:${port}/api/docs`);
}

bootstrap();
