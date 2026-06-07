// EnrichmentWorker — the BullMQ consumer for per-lead enrichment (File 08).
//
// WHY: bulk enrichment is enqueued one job per lead (by the API) so progress is
// per-lead and one failing lead never fails the batch. This worker runs each job
// through EnrichmentService.enrichLead, which is metered via the credit gate and
// updates leads.enrichment_status as it goes (the UI polls that). Concurrency is
// capped so we don't hammer external APIs (Places/Firecrawl/LLM).
//
// Guarded startup: with no REDIS_URL the worker logs a warning and stays idle
// (no crash), matching the rest of the worker app.
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, type ConnectionOptions } from 'bullmq';
import {
  buildRedisConnection,
  EnrichmentService,
  ENRICHMENT_QUEUE,
  type EnrichLeadJob,
} from '@extrovertai/server';

const CONCURRENCY = 3; // be a polite neighbour to Places/Firecrawl/OpenRouter

@Injectable()
export class EnrichmentWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EnrichmentWorker.name);
  private worker?: Worker<EnrichLeadJob>;

  constructor(
    private readonly config: ConfigService,
    private readonly enrichment: EnrichmentService,
  ) {}

  onModuleInit(): void {
    const redisUrl = this.config.get<string>('REDIS_URL');
    if (!redisUrl) {
      this.logger.warn('REDIS_URL not set — enrichment worker idle (no queue).');
      return;
    }
    const connection = buildRedisConnection(redisUrl) as ConnectionOptions;

    this.worker = new Worker<EnrichLeadJob>(
      ENRICHMENT_QUEUE,
      async (job) => {
        const { userId, leadId } = job.data;
        const outcome = await this.enrichment.enrichLead(userId, leadId);
        // enrichLead never throws for normal/partial/out-of-credits paths; it
        // returns a typed outcome and persists status. Surface it in logs.
        this.logger.log(`Lead ${leadId}: ${outcome.status}`);
        return outcome;
      },
      { connection, concurrency: CONCURRENCY },
    );

    this.worker.on('failed', (job, err) => {
      this.logger.warn(`enrich job ${job?.id} threw unexpectedly: ${err.message}`);
    });

    this.logger.log(`Enrichment worker running (concurrency ${CONCURRENCY}).`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close();
  }
}
