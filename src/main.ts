import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { Request, Response } from 'express';
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

  app.use(cookieParser());

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

  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    const clientPath = path.join(__dirname, '../frontend-dist/browser');
    app.use(express.static(clientPath));

    const httpAdapter = app.getHttpAdapter();
    const server = httpAdapter.getInstance();

    server.get(
      /^\/(?!auth|user|sets|suppliers|clients|comments|positions|bookmarks|settings|errors|email|files|images).*/,
      (req: Request, res: Response) => {
        res.sendFile(path.join(clientPath, 'index.html'));
      },
    );
  }

  await app.listen(3005);
}
bootstrap();
