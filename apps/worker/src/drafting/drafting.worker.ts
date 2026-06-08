// DraftingWorker — the BullMQ consumer for per-lead draft generation (File 09).
//
// WHY: bulk drafting is enqueued one job per lead (by the API) so progress is
// per-lead and one failing lead never fails the batch (mirrors File 08). Each job
// runs DraftingService.draftForLead, which is metered via the credit gate and
// writes the draft sequence to the messages holding area. Concurrency is capped
// so we don't hit the LLM's rate limits.
//
// Guarded startup: with no REDIS_URL the worker logs a warning and stays idle.
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, type ConnectionOptions } from 'bullmq';
import {
  buildRedisConnection,
  DraftingService,
  DRAFTING_QUEUE,
  type DraftLeadJob,
} from '@extrovertai/server';

const CONCURRENCY = 2; // free LLM models are rate-limited (File 05 notes)

@Injectable()
export class DraftingWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DraftingWorker.name);
  private worker?: Worker<DraftLeadJob>;

  constructor(
    private readonly config: ConfigService,
    private readonly drafting: DraftingService,
  ) {}

  onModuleInit(): void {
    const redisUrl = this.config.get<string>('REDIS_URL');
    if (!redisUrl) {
      this.logger.warn('REDIS_URL not set — drafting worker idle (no queue).');
      return;
    }
    const connection = buildRedisConnection(redisUrl) as ConnectionOptions;

    this.worker = new Worker<DraftLeadJob>(
      DRAFTING_QUEUE,
      async (job) => {
        const { userId, leadId } = job.data;
        const outcome = await this.drafting.draftForLead(userId, leadId);
        this.logger.log(`Lead ${leadId}: ${outcome.status}`);
        return outcome;
      },
      { connection, concurrency: CONCURRENCY },
    );

    this.worker.on('failed', (job, err) => {
      this.logger.warn(`draft job ${job?.id} threw unexpectedly: ${err.message}`);
    });

    this.logger.log(`Drafting worker running (concurrency ${CONCURRENCY}).`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close();
  }
}
