// SendingWorker — the BullMQ consumer that drives the sequence engine (File 10).
//
// WHY: each job sends ONE message-step via SendingService.processSend, then this
// worker acts on the outcome: schedule the follow-up as a DELAYED job, retry later
// (no capacity / rate-limited / transient), or do nothing (sent-final / stopped /
// paused / failed). Throttling is enforced two ways: a BullMQ rate limiter +
// concurrency 1 (sequential), plus a random jitter per send for human-like spacing.
// Per-inbox daily caps + warm-up are enforced inside SendingService.
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker, type ConnectionOptions } from 'bullmq';
import {
  buildRedisConnection,
  SendingService,
  SENDING_QUEUE,
  SEND_JITTER_MS,
  SEND_SPACING_MS,
  type SendStepJob,
  type SendOutcome,
} from '@extrovertai/server';

@Injectable()
export class SendingWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SendingWorker.name);
  private worker?: Worker<SendStepJob>;
  private queue?: Queue<SendStepJob>;

  constructor(
    private readonly config: ConfigService,
    private readonly sending: SendingService,
  ) {}

  onModuleInit(): void {
    const redisUrl = this.config.get<string>('REDIS_URL');
    if (!redisUrl) {
      this.logger.warn('REDIS_URL not set — sending worker idle (no queue).');
      return;
    }
    const connection = buildRedisConnection(redisUrl) as ConnectionOptions;
    this.queue = new Queue<SendStepJob>(SENDING_QUEUE, { connection });

    this.worker = new Worker<SendStepJob>(
      SENDING_QUEUE,
      async (job) => {
        // Human-like jitter on top of the rate limiter (avoid robotic bursts).
        await this.sleep(Math.floor(Math.random() * SEND_JITTER_MS));
        const { userId, messageId } = job.data;
        const outcome = await this.sending.processSend(userId, messageId);
        await this.act(userId, outcome);
        this.logger.log(`Send ${messageId}: ${outcome.kind}`);
        return outcome;
      },
      {
        connection,
        concurrency: 1, // one send at a time = naturally spaced + simple counters
        limiter: { max: 1, duration: SEND_SPACING_MS },
      },
    );

    this.worker.on('failed', (job, err) => {
      this.logger.warn(`send job ${job?.id} threw unexpectedly: ${err.message}`);
    });

    this.logger.log('Sending worker running (concurrency 1, throttled).');
  }

  /** React to a send outcome: schedule the next step or a retry. */
  private async act(userId: string, outcome: SendOutcome): Promise<void> {
    if (!this.queue) return;
    if (outcome.kind === 'sent' && outcome.nextStep) {
      await this.enqueue(userId, outcome.nextStep.messageId, outcome.nextStep.delayMs);
    } else if (outcome.kind === 'retry') {
      await this.enqueue(userId, outcome.messageId, outcome.delayMs);
    }
    // sent-final / stopped / paused / failed / skipped → nothing more to schedule.
  }

  private async enqueue(userId: string, messageId: string, delayMs: number): Promise<void> {
    await this.queue?.add(
      'send',
      { userId, messageId },
      { delay: delayMs, removeOnComplete: true, removeOnFail: 200, attempts: 1 },
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close();
    await this.queue?.close();
  }
}
