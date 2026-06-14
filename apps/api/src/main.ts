// API entrypoint.
// WHY: boots the NestJS HTTP server, loads config from the repo-root .env, and
// installs a global validation pipe so every later DTO is validated by default.
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  // rawBody: true captures the exact request bytes (alongside the parsed body) so the
  // Cal.com webhook can HMAC-verify the unmodified payload (File 13). Re-parsing JSON
  // would change key order/whitespace and break the signature.
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Allow the Angular dev app (and other local origins) to call the API with the
  // Supabase Bearer token. Tighten the allowed origins for production later.
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = app.get(ConfigService);
  const port = Number(config.get<string>('API_PORT') ?? 3000);

  await app.listen(port);
  Logger.log(`API listening on http://localhost:${port}`, 'Bootstrap');
}

void bootstrap();
