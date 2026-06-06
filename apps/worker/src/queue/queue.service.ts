// Queue service (placeholder).
// WHY: BullMQ needs a live Redis connection, which may not exist during early
// local dev. This guard logs a clear warning instead of crashing the worker when
// REDIS_URL is unset. Actual queues/processors are wired up in File 06+.
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const redisUrl = this.config.get<string>('REDIS_URL');

    if (!redisUrl) {
      this.logger.warn(
        'REDIS_URL is not set — queue is disabled (no Redis connection). ' +
          'This is expected before File 06; processors will be wired up then.',
      );
      return;
    }

    this.logger.log(
      'REDIS_URL detected — queues will be connected when processors are added (File 06+).',
    );
  }
}
