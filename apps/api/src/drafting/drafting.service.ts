// DraftingApiService — the HTTP side of drafting (File 09).
//
// WHY: the heavy LLM work runs in the WORKER (per-lead, metered). The API (1)
// enqueues one draft job per selected lead behind an upfront balance gate (never
// silently dropping leads), (2) serves the review queue (drafts grouped per lead
// with the hook), and (3) handles inline edits, approval, and regenerate.
import { Injectable, Logger, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, type ConnectionOptions } from 'bullmq';
import {
  BillingService,
  DraftingService,
  SupabaseService,
  buildRedisConnection,
  DRAFTING_QUEUE,
  type DraftLeadJob,
} from '@extrovertai/server';
import { CREDIT_COSTS } from '@extrovertai/shared';
import type { Tables } from '@extrovertai/shared';

export interface DraftMessage {
  id: string;
  step_order: number;
  subject: string | null;
  body: string | null;
  approved: boolean;
}

export interface LeadDrafts {
  leadId: string;
  name: string | null;
  website: string | null;
  email: string | null;
  hook: string | null;
  drafts: DraftMessage[];
}

export type EnqueueResult =
  | {
      ok: true;
      enqueued: number;
      skipped: number;
      costPer: number;
      balance: number;
      reason: 'partial_credits' | null;
    }
  | { ok: false; reason: 'out_of_credits' | 'unavailable'; enqueued: 0; balance: number };

type LeadRow = Pick<Tables<'leads'>, 'id' | 'name' | 'website' | 'email' | 'hook'>;

@Injectable()
export class DraftingApiService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DraftingApiService.name);
  private queue?: Queue<DraftLeadJob>;

  constructor(
    private readonly config: ConfigService,
    private readonly billing: BillingService,
    private readonly supabase: SupabaseService,
    private readonly drafting: DraftingService,
  ) {}

  onModuleInit(): void {
    const redisUrl = this.config.get<string>('REDIS_URL');
    if (!redisUrl) {
      this.logger.warn('REDIS_URL not set — drafting cannot be enqueued.');
      return;
    }
    const connection = buildRedisConnection(redisUrl) as ConnectionOptions;
    this.queue = new Queue<DraftLeadJob>(DRAFTING_QUEUE, { connection });
  }

  /** Enqueue drafting for selected leads (owned, not already drafted), gated by balance. */
  async enqueue(userId: string, leadIds: string[]): Promise<EnqueueResult> {
    const balance = await this.billing.getBalance(userId);
    if (!this.queue) return { ok: false, reason: 'unavailable', enqueued: 0, balance };

    const eligible = await this.eligibleLeads(userId, leadIds);
    const costPer = CREDIT_COSTS.draft;
    const affordable = costPer > 0 ? Math.floor(balance / costPer) : eligible.length;

    if (affordable <= 0 && eligible.length > 0) {
      return { ok: false, reason: 'out_of_credits', enqueued: 0, balance };
    }

    const toEnqueue = eligible.slice(0, affordable);
    const skipped = eligible.length - toEnqueue.length;
    if (toEnqueue.length > 0) await this.addJobs(userId, toEnqueue);

    return {
      ok: true,
      enqueued: toEnqueue.length,
      skipped,
      costPer,
      balance,
      reason: skipped > 0 ? 'partial_credits' : null,
    };
  }

  /** Drafts grouped per lead (review queue). Includes the hook so the user sees WHY. */
  async byLeads(userId: string, leadIds: string[]): Promise<LeadDrafts[]> {
    if (leadIds.length === 0) return [];
    const admin = this.supabase.getAdminClient();
    const leads = await admin
      .from('leads')
      .select('id,name,website,email,hook')
      .eq('user_id', userId)
      .in('id', leadIds);
    const leadRows = (leads.data as LeadRow[]) ?? [];
    if (leadRows.length === 0) return [];

    const ownedIds = leadRows.map((l) => l.id);
    const msgs = await admin
      .from('messages')
      .select('id,lead_id,step_order,subject,body,approved')
      .in('lead_id', ownedIds)
      .is('campaign_id', null)
      .eq('state', 'queued')
      .order('step_order', { ascending: true });
    const byLead = new Map<string, DraftMessage[]>();
    for (const m of msgs.data ?? []) {
      const list = byLead.get(m.lead_id) ?? [];
      list.push({ id: m.id, step_order: m.step_order, subject: m.subject, body: m.body, approved: m.approved });
      byLead.set(m.lead_id, list);
    }

    return leadRows.map((l) => ({
      leadId: l.id,
      name: l.name,
      website: l.website,
      email: l.email,
      hook: l.hook,
      drafts: byLead.get(l.id) ?? [],
    }));
  }

  /** Edit one draft message (subject/body). Scoped to the caller via the lead. */
  async edit(
    userId: string,
    messageId: string,
    patch: { subject?: string; body?: string },
  ): Promise<DraftMessage> {
    const admin = this.supabase.getAdminClient();
    await this.assertOwnsMessage(userId, messageId);
    const update: Partial<Pick<Tables<'messages'>, 'subject' | 'body'>> = {};
    if (patch.subject !== undefined) update.subject = patch.subject;
    if (patch.body !== undefined) update.body = patch.body;
    const { data, error } = await admin
      .from('messages')
      .update(update)
      .eq('id', messageId)
      .select('id,step_order,subject,body,approved')
      .single();
    if (error || !data) throw new NotFoundException('Draft not found.');
    return data;
  }

  /** Approve all of a lead's holding-area drafts → ready for sending (File 10). */
  async approve(userId: string, leadId: string): Promise<{ approved: number }> {
    await this.assertOwnsLead(userId, leadId);
    const { data, error } = await this.supabase
      .getAdminClient()
      .from('messages')
      .update({ approved: true })
      .eq('lead_id', leadId)
      .is('campaign_id', null)
      .eq('state', 'queued')
      .select('id');
    if (error) throw new NotFoundException('Could not approve drafts.');
    return { approved: data?.length ?? 0 };
  }

  /** Regenerate a lead's drafts: delete existing, then re-enqueue (metered again). */
  async regenerate(userId: string, leadId: string): Promise<{ ok: boolean; balance: number; reason?: string }> {
    await this.assertOwnsLead(userId, leadId);
    const balance = await this.billing.getBalance(userId);
    if (!this.queue) return { ok: false, balance, reason: 'unavailable' };
    if (balance < CREDIT_COSTS.draft) return { ok: false, balance, reason: 'out_of_credits' };
    await this.drafting.deleteDrafts(userId, leadId);
    await this.addJobs(userId, [leadId]);
    return { ok: true, balance };
  }

  async onModuleDestroy(): Promise<void> {
    await this.queue?.close();
  }

  // --- internals ---

  private async eligibleLeads(userId: string, leadIds: string[]): Promise<string[]> {
    const admin = this.supabase.getAdminClient();
    const owned = await admin.from('leads').select('id').eq('user_id', userId).in('id', leadIds);
    const ownedIds = (owned.data ?? []).map((r) => r.id);
    if (ownedIds.length === 0) return [];
    // Exclude leads that already have holding-area drafts (no re-charge / no clobber).
    const drafted = await admin
      .from('messages')
      .select('lead_id')
      .in('lead_id', ownedIds)
      .is('campaign_id', null)
      .eq('state', 'queued');
    const have = new Set((drafted.data ?? []).map((r) => r.lead_id));
    return ownedIds.filter((id) => !have.has(id));
  }

  private async addJobs(userId: string, leadIds: string[]): Promise<void> {
    if (!this.queue) return;
    await this.queue.addBulk(
      leadIds.map((leadId) => ({
        name: 'draft',
        data: { userId, leadId },
        opts: { removeOnComplete: true, removeOnFail: 100, attempts: 1 },
      })),
    );
  }

  private async assertOwnsLead(userId: string, leadId: string): Promise<void> {
    const { data } = await this.supabase
      .getAdminClient()
      .from('leads')
      .select('id')
      .eq('id', leadId)
      .eq('user_id', userId)
      .maybeSingle();
    if (!data) throw new NotFoundException('Lead not found.');
  }

  private async assertOwnsMessage(userId: string, messageId: string): Promise<void> {
    const admin = this.supabase.getAdminClient();
    const msg = await admin.from('messages').select('lead_id').eq('id', messageId).maybeSingle();
    if (!msg.data) throw new NotFoundException('Draft not found.');
    await this.assertOwnsLead(userId, msg.data.lead_id);
  }
}
