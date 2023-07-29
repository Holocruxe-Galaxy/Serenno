import { NestFactory } from '@nestjs/core';
import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { AppModule } from './app.module';

const port = process.env.PORT || 3000;

export const validationOptions: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: false,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port, '0.0.0.0');

  app.useGlobalPipes(new ValidationPipe(validationOptions));
}
bootstrap();
