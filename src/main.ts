import { NestFactory } from '@nestjs/core';
import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

const port = process.env.PORT || 3001;

export const validationOptions: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: false,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  const configService = app.get(ConfigService);
  const LOCAL = configService.get<string>('LOCAL');
  const FRONT = configService.get<string>('FRONT');

  app.enableCors({
    origin: FRONT,
    credentials: true,
  });

  if (LOCAL) {
    await app.listen(port);
  } else {
    await app.listen(port, '0.0.0.0');
  }
}
bootstrap();
