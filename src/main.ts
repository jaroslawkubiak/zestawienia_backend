import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { Request, Response } from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ErrorsService } from './errors/errors.service';
import { QueryFailedExceptionFilter } from './filters/queryFailedException.filter';
import { ValidationExceptionFilter } from './filters/validationException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // If the app runs behind a proxy (nginx, etc.), trust the proxy so
  // `req.secure` and `x-forwarded-*` headers are respected.
  // Operate on the underlying Express instance to avoid TypeScript errors
  const expressInstance = app.getHttpAdapter().getInstance();
  if (expressInstance && typeof expressInstance.set === 'function') {
    expressInstance.set('trust proxy', true);
  }

  app.use(cookieParser());

  // enable CORS
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://zestawienia.zurawickidesign.pl',
      'http://zestawienia.host355495.stronawcal.pl',
    ],
    credentials: true,
    methods: 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // add /api to every backend endpoint
  app.setGlobalPrefix('api');

  // Angular
  const angularPath = join(process.cwd(), 'public');
  app.use(express.static(angularPath));

  // UPLOADS
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // FILTERS
  app.useGlobalFilters(
    new ValidationExceptionFilter(app.get(ErrorsService)),
    new QueryFailedExceptionFilter(app.get(ErrorsService)),
  );

  const server = app.getHttpAdapter().getInstance();

  // SPA fallback
  server.get('*', (req: Request, res: Response, next: Function) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    res.sendFile(join(angularPath, 'index.html'));
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
