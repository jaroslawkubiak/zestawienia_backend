import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorsService } from './errors/errors.service';
import { QueryFailedExceptionFilter } from './filters/queryFailedException.filter';
import { ValidationExceptionFilter } from './filters/validationException.filter';
import * as path from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Włączenie CORS
  app.enableCors({
    origin: 'http://localhost:4200', // Zezwól tylko na Angulara
    methods: 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Serwowanie plików statycznych
  app.use(
    '/uploads',
    express.static(
      path.join(process.cwd(), process.env.UPLOAD_PATH, '..', 'uploads'),
    ),
  );


  app.useGlobalFilters(new ValidationExceptionFilter(app.get(ErrorsService)));

  app.useGlobalFilters(new QueryFailedExceptionFilter(app.get(ErrorsService)));

  await app.listen(3005, '127.0.0.1');
}
bootstrap();
