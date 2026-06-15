// EnrichmentApiService — the HTTP side of enrichment (File 08).
//
// WHY: the heavy enrichment work runs in the WORKER (per-lead, metered). The API's
// job is to (1) enqueue one BullMQ job per selected lead and (2) let the UI poll
// per-lead progress. Before enqueuing we do an upfront balance check so we never
// silently drop leads: we enqueue only what the user can afford and tell the UI
// exactly how many were skipped for credits (the worker's gate is the final
// safety net for races — master-context §6).
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, type ConnectionOptions } from 'bullmq';
import {
  BillingService,
  EnrichmentService as EnrichmentCoreService,
  SupabaseService,
  buildRedisConnection,
  ENRICHMENT_QUEUE,
  type EnrichLeadJob,
} from '@extrovertai/server';
import { CREDIT_COSTS, EnrichmentStatus } from '@extrovertai/shared';
import type { Tables } from '@extrovertai/shared';

export type EnrichedLead = Pick<
  Tables<'leads'>,
  | 'id'
  | 'name'
  | 'website'
  | 'email'
  | 'phone'
  | 'address'
  | 'rating'
  | 'review_count'
  | 'reviews'
  | 'hook'
  | 'status'
  | 'enrichment_status'
>;

export type EnqueueResult =
  | {
      ok: true;
      enqueued: number;
      enqueuedLeadIds: string[];
      skipped: number;
      costPer: number;
      balance: number;
      reason: 'partial_credits' | null;
    }
  | { ok: false; reason: 'out_of_credits' | 'unavailable'; enqueued: 0; balance: number };

const ENRICHED_COLUMNS =
  'id,name,website,email,phone,address,rating,review_count,reviews,hook,status,enrichment_status';

@Injectable()
export class EnrichmentApiService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EnrichmentApiService.name);
  private queue?: Queue<EnrichLeadJob>;

  constructor(
    private readonly config: ConfigService,
    private readonly billing: BillingService,
    private readonly supabase: SupabaseService,
    private readonly enrichment: EnrichmentCoreService,
  ) {}

  onModuleInit(): void {
    const redisUrl = this.config.get<string>('REDIS_URL');
    if (!redisUrl) {
      this.logger.warn('REDIS_URL not set — enrichment cannot be enqueued.');
      return;
    }
    const connection = buildRedisConnection(redisUrl) as ConnectionOptions;
    this.queue = new Queue<EnrichLeadJob>(ENRICHMENT_QUEUE, { connection });
  }

  /**
   * Enqueue enrichment for the user's selected leads. Only leads the user owns and
   * that aren't already enriched are queued. Enqueues at most what the balance can
   * cover, reporting how many were skipped for credits.
   */
  async enqueue(userId: string, leadIds: string[]): Promise<EnqueueResult> {
    const balance = await this.billing.getBalance(userId);
    if (!this.queue) {
      return { ok: false, reason: 'unavailable', enqueued: 0, balance };
    }

    // Keep only leads the user owns and that still need enriching (no re-charge).
    const { data } = await this.supabase
      .getAdminClient()
      .from('leads')
      .select('id,enrichment_status')
      .eq('user_id', userId)
      .in('id', leadIds);
    const eligible = (data ?? [])
      .filter((l) => l.enrichment_status !== EnrichmentStatus.Complete)
      .map((l) => l.id);

    const costPer = CREDIT_COSTS.enrichment;
    const affordable = costPer > 0 ? Math.floor(balance / costPer) : eligible.length;

    if (affordable <= 0 && eligible.length > 0) {
      return { ok: false, reason: 'out_of_credits', enqueued: 0, balance };
    }

    const toEnqueue = eligible.slice(0, affordable);
    const skipped = eligible.length - toEnqueue.length;

    if (toEnqueue.length > 0) {
      // Show them as queued immediately so the UI reflects intent before the worker runs.
      await this.supabase
        .getAdminClient()
        .from('leads')
        .update({ enrichment_status: EnrichmentStatus.Pending })
        .eq('user_id', userId)
        .in('id', toEnqueue);

      // If a dedicated worker is consuming this queue, hand the jobs off to it.
      // Otherwise (e.g. local dev running only web + api) there'd be no consumer
      // and leads would sit at "queued" forever — so we process them inline.
      const hasWorker = await this.hasQueueConsumer();
      if (hasWorker) {
        await this.queue.addBulk(
          toEnqueue.map((leadId) => ({
            name: 'enrich',
            data: { userId, leadId },
            opts: { removeOnComplete: true, removeOnFail: 100, attempts: 1 },
          })),
        );
      } else {
        this.logger.warn(
          `No enrichment worker detected — processing ${toEnqueue.length} lead(s) inline.`,
        );
        // Fire-and-forget so the HTTP response returns immediately; the UI polls
        // /enrichment/status for per-lead progress just as it would for the worker.
        void this.processInline(userId, toEnqueue);
      }
    }

    return {
      ok: true,
      enqueued: toEnqueue.length,
      enqueuedLeadIds: toEnqueue,
      skipped,
      costPer,
      balance,
      reason: skipped > 0 ? 'partial_credits' : null,
    };
  }

  /** True when a BullMQ worker is registered against the enrichment queue. */
  private async hasQueueConsumer(): Promise<boolean> {
    if (!this.queue) return false;
    try {
      const workers = await this.queue.getWorkers();
      return workers.length > 0;
    } catch {
      // If we can't tell, assume no worker and process inline — better to do the
      // work than to leave leads stuck at "queued".
      return false;
    }
  }

  /**
   * Inline enrichment fallback for when no worker is consuming the queue. Runs
   * leads sequentially (one external-API-heavy job at a time) so we stay a polite
   * neighbour to Places/Firecrawl/LLM, mirroring the worker's metering. Errors are
   * swallowed per-lead: enrichLead persists a 'failed' status the UI surfaces.
   */
  private async processInline(userId: string, leadIds: string[]): Promise<void> {
    for (const leadId of leadIds) {
      try {
        const outcome = await this.enrichment.enrichLead(userId, leadId);
        this.logger.log(`Inline enrich ${leadId}: ${outcome.status}`);
      } catch (err) {
        this.logger.warn(`Inline enrich ${leadId} threw: ${(err as Error).message}`);
      }
    }
  }

  /** Current enrichment fields for the given leads (for the UI's progress poll). */
  async status(userId: string, leadIds: string[]): Promise<EnrichedLead[]> {
    if (leadIds.length === 0) return [];
    const { data } = await this.supabase
      .getAdminClient()
      .from('leads')
      .select(ENRICHED_COLUMNS)
      .eq('user_id', userId)
      .in('id', leadIds);
    return (data as EnrichedLead[]) ?? [];
  }

  async onModuleDestroy(): Promise<void> {
    await this.queue?.close();
  }
}
