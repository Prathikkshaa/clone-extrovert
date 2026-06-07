// QueueService — BullMQ wiring + the metering-gate demonstrator.
//
// WHY: connects BullMQ to Redis (Upstash) and runs a trivial "metering-test"
// queue whose processor wraps a fake external call in BillingService.withCreditGate
// — proving reserve→commit (success) and reserve→refund (failure) end-to-end.
// Real queues (search/enrichment/sending) are added in their own files; they all
// follow this same gated pattern. Guarded startup: with no REDIS_URL the worker
// logs a clear warning and runs without queues (does not crash).
//
// Connection is passed to BullMQ as options (parsed from REDIS_URL) so BullMQ uses
// its own bundled ioredis — avoiding cross-copy type/instance mismatches.
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker, type ConnectionOptions } from 'bullmq';
import { BillingService } from '@extrovertai/server';
import type { CreditAction } from '@extrovertai/shared';

export const METERING_TEST_QUEUE = 'metering-test';

export interface MeteringTestJob {
  userId: string;
  action: CreditAction;
  shouldFail?: boolean;
}

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private testQueue?: Queue<MeteringTestJob>;
  private testWorker?: Worker<MeteringTestJob>;

  constructor(
    private readonly config: ConfigService,
    private readonly billing: BillingService,
  ) {}

  onModuleInit(): void {
    const redisUrl = this.config.get<string>('REDIS_URL');
    if (!redisUrl) {
      this.logger.warn(
        'REDIS_URL is not set — queues are disabled (worker runs without BullMQ).',
      );
      return;
    }

    const connection = this.buildConnection(redisUrl);
    this.testQueue = new Queue<MeteringTestJob>(METERING_TEST_QUEUE, { connection });

    this.testWorker = new Worker<MeteringTestJob>(
      METERING_TEST_QUEUE,
      async (job) => {
        const { userId, action, shouldFail } = job.data;
        // The mandatory pattern: wrap the paid "external call" in the credit gate.
        return this.billing.withCreditGate(userId, action, null, async () => {
          await new Promise((r) => setTimeout(r, 50)); // fake external call
          if (shouldFail) throw new Error('simulated external failure');
          return { done: true };
        });
      },
      { connection },
    );

    this.testWorker.on('failed', (job, err) => {
      this.logger.warn(`metering-test job ${job?.id} failed (refunded): ${err.message}`);
    });

    this.logger.log('BullMQ connected — metering-test worker running.');
  }

  /** Enqueue a metering-test job (used by verification). */
  async enqueueTest(data: MeteringTestJob): Promise<string> {
    if (!this.testQueue) throw new Error('Queue not available (REDIS_URL not set).');
    const job = await this.testQueue.add('run', data, {
      removeOnComplete: true,
      removeOnFail: true,
    });
    return job.id ?? '';
  }

  async onModuleDestroy(): Promise<void> {
    await this.testWorker?.close();
    await this.testQueue?.close();
  }

  /** Parse a redis(s):// URL into BullMQ connection options (its own ioredis). */
  private buildConnection(redisUrl: string): ConnectionOptions {
    const u = new URL(redisUrl);
    return {
      host: u.hostname,
      port: Number(u.port || 6379),
      username: u.username ? decodeURIComponent(u.username) : undefined,
      password: u.password ? decodeURIComponent(u.password) : undefined,
      tls: u.protocol === 'rediss:' ? {} : undefined,
      maxRetriesPerRequest: null, // required by BullMQ blocking connections
    };
  }
}
