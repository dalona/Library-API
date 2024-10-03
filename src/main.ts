import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // Aplicar el filtro globalmente
  app.useGlobalFilters(new AllExceptionsFilter());
  // Aplicar el pipe de validación globalmente
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();