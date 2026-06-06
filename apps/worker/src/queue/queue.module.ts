// Queue module (placeholder).
// WHY: reserves the home for BullMQ queues and processors (added in File 06+).
// For now it only verifies whether a Redis connection is configured, so the
// worker boots cleanly with a clear warning when REDIS_URL is absent.
import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';

@Module({
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
