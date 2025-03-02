import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Włączenie CORS
  app.enableCors({
    origin: 'http://localhost:4200', // Zezwól tylko na Angulara
    methods: 'GET,POST,PUT,DELETE,OPTIONS', 
    allowedHeaders: 'Content-Type, Authorization', 
  });

  await app.listen(3005, '127.0.0.1');
}
bootstrap();
