import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorsService } from './errors/errors.service';
import { QueryFailedExceptionFilter } from './filters/queryFailedException.filter';
import { ValidationExceptionFilter } from './filters/validationException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Włączenie CORS
  app.enableCors({
    origin: 'http://localhost:4200', // Zezwól tylko na Angulara
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.useGlobalFilters(new ValidationExceptionFilter(app.get(ErrorsService)));

  app.useGlobalFilters(new QueryFailedExceptionFilter());

  await app.listen(3005, '127.0.0.1');
}
bootstrap();
