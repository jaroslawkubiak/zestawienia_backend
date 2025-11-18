import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as path from 'path';
import { AppModule } from './app.module';
import { ErrorsService } from './errors/errors.service';
import { QueryFailedExceptionFilter } from './filters/queryFailedException.filter';
import { ValidationExceptionFilter } from './filters/validationException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = [
    'http://localhost:4200', // dev
    'https://zestawienia.zurawickidesign.pl', // produkcja
  ];

  // Włączenie CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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

  await app.listen(3005);
}
bootstrap();
