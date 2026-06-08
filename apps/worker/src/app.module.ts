// Root worker module.
// WHY: composition root for the standalone worker. Loads global config from the
// repo-root .env and mounts the queue module. Processors arrive in File 06+.
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QueueModule } from './queue/queue.module';
import { EnrichmentWorkerModule } from './enrichment/enrichment.worker.module';
import { DraftingWorkerModule } from './drafting/drafting.worker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Run from apps/worker, so the repo-root .env is two levels up.
      envFilePath: ['../../.env'],
    }),
    QueueModule,
    EnrichmentWorkerModule,
    DraftingWorkerModule,
  ],
})
export class AppModule {}
