// EnrichmentWorkerModule — mounts the enrichLead BullMQ consumer in the worker.
import { Module } from '@nestjs/common';
import { EnrichmentModule } from '@extrovertai/server';
import { EnrichmentWorker } from './enrichment.worker';

@Module({
  imports: [EnrichmentModule],
  providers: [EnrichmentWorker],
})
export class EnrichmentWorkerModule {}
