// Worker entrypoint.
// WHY: boots a NestJS *standalone* application (no HTTP server) that hosts
// background queue processing. Processors are added in File 06+. The process is
// kept alive and shuts down cleanly on SIGINT/SIGTERM.
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { APP_NAME } from '@extrovertai/shared';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  app.enableShutdownHooks();

  const logger = new Logger('Worker');
  logger.log(`${APP_NAME} worker started`);

  // Keep the process alive as a long-running daemon. Real queue Workers (File
  // 06+) hold the event loop open via their Redis connections; until then this
  // heartbeat prevents the standalone context from exiting immediately after boot.
  const keepAlive = setInterval(() => {}, 1 << 30);

  const shutdown = async (signal: string): Promise<void> => {
    logger.log(`Received ${signal}, shutting down worker`);
    clearInterval(keepAlive);
    await app.close();
    process.exit(0);
  };
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

void bootstrap();
