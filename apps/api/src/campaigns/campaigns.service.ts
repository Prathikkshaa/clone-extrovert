// CampaignsService — launch + monitor an outreach campaign (File 10).
//
// WHY: turns a list's APPROVED drafts (File 09 holding-area messages) into a
// running campaign: create the campaign + sequence_steps, link the drafts, and
// enqueue the first send per lead (one BullMQ job each). The worker paces sends
// (throttle + warm-up + rotation) and chains follow-ups as delayed jobs. This
// service also serves the send plan (how many fit today) and the campaign monitor.
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, type ConnectionOptions } from 'bullmq';
import {
  ComplianceService,
  MailboxCapacityService,
  SupabaseService,
  buildRedisConnection,
  FOLLOWUP_WAIT_DAYS,
  SENDING_QUEUE,
  type CapacitySummary,
  type SendStepJob,
} from '@extrovertai/server';
import type { Tables } from '@extrovertai/shared';

export interface SendPlan {
  hasMailbox: boolean;
  needsAddress: boolean; // physical mailing address missing (legally required)
  leadCount: number; // leads with approved drafts ready to start
  todayCount: number; // how many can go out today within safe limits
  laterCount: number; // the rest, scheduled for upcoming days
  capacity: CapacitySummary;
}

export type StartResult =
  | { ok: true; campaignId: string; plan: SendPlan }
  | { ok: false; reason: 'no_mailbox' | 'no_drafts' | 'no_address' };

export interface CampaignStepState {
  step_order: number;
  state: string;
  sent_at: string | null;
  send_error: string | null;
}
export interface CampaignLeadState {
  leadId: string;
  name: string | null;
  email: string | null;
  steps: CampaignStepState[];
}
export interface CampaignSummary {
  id: string;
  status: string;
  channel: string;
  created_at: string;
  counts: { total: number; sent: number; replied: number; bounced: number; stopped: number; queued: number };
}
export interface CampaignDetail extends CampaignSummary {
  leads: CampaignLeadState[];
  capacity: CapacitySummary;
}

type DraftMsg = Pick<Tables<'messages'>, 'id' | 'lead_id' | 'step_order'>;

@Injectable()
export class CampaignsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CampaignsService.name);
  private queue?: Queue<SendStepJob>;

  constructor(
    private readonly config: ConfigService,
    private readonly supabase: SupabaseService,
    private readonly capacity: MailboxCapacityService,
    private readonly compliance: ComplianceService,
  ) {}

  onModuleInit(): void {
    const redisUrl = this.config.get<string>('REDIS_URL');
    if (!redisUrl) {
      this.logger.warn('REDIS_URL not set — campaigns cannot be started.');
      return;
    }
    const connection = buildRedisConnection(redisUrl) as ConnectionOptions;
    this.queue = new Queue<SendStepJob>(SENDING_QUEUE, { connection });
  }

  /** Preview the send plan for a list's approved drafts (no side effects). */
  async plan(userId: string, listId: string): Promise<SendPlan> {
    await this.assertOwnsList(userId, listId);
    const drafts = await this.approvedDrafts(userId, listId);
    const leadCount = new Set(drafts.map((d) => d.lead_id)).size;
    const capacity = await this.capacity.summary(userId);
    const todayCount = Math.min(leadCount, capacity.totalRemaining);
    return {
      hasMailbox: capacity.connectedCount > 0,
      needsAddress: !(await this.compliance.physicalAddress(userId)),
      leadCount,
      todayCount,
      laterCount: Math.max(0, leadCount - todayCount),
      capacity,
    };
  }

  /** Create the campaign, link drafts, and enqueue the first send per lead. */
  async start(userId: string, listId: string): Promise<StartResult> {
    await this.assertOwnsList(userId, listId);
    const capacity = await this.capacity.summary(userId);
    if (capacity.connectedCount === 0) return { ok: false, reason: 'no_mailbox' };

    // Compliance: a mailing address is legally required in every email — fail fast.
    if (!(await this.compliance.physicalAddress(userId))) {
      return { ok: false, reason: 'no_address' };
    }

    const drafts = await this.approvedDrafts(userId, listId);
    if (drafts.length === 0) return { ok: false, reason: 'no_drafts' };

    const admin = this.supabase.getAdminClient();
    const mode = (await this.userMode(userId)) ?? 'draft';

    // 1) Campaign row.
    const campaign = await admin
      .from('campaigns')
      .insert({ user_id: userId, list_id: listId, channel: 'email', mode, status: 'active' })
      .select('id')
      .single();
    if (campaign.error || !campaign.data) {
      throw new BadRequestException('Could not create the campaign.');
    }
    const campaignId = campaign.data.id;

    // 2) Sequence steps from the distinct step orders present (wait gaps).
    const stepOrders = [...new Set(drafts.map((d) => d.step_order))].sort((a, b) => a - b);
    await admin.from('sequence_steps').insert(
      stepOrders.map((step_order) => ({
        campaign_id: campaignId,
        step_order,
        wait_days: step_order <= 1 ? 0 : FOLLOWUP_WAIT_DAYS,
      })),
    );

    // 3) Link the approved drafts to the campaign (still queued).
    const messageIds = drafts.map((d) => d.id);
    await admin.from('messages').update({ campaign_id: campaignId }).in('id', messageIds);

    // 4) Enqueue the first step per lead; the worker paces + chains follow-ups.
    const firstStepByLead = this.firstStepPerLead(drafts);
    if (this.queue) {
      await this.queue.addBulk(
        firstStepByLead.map((messageId) => ({
          name: 'send',
          data: { userId, messageId },
          opts: { removeOnComplete: true, removeOnFail: 200, attempts: 1 },
        })),
      );
    }

    const leadCount = firstStepByLead.length;
    const todayCount = Math.min(leadCount, capacity.totalRemaining);
    return {
      ok: true,
      campaignId,
      plan: {
        hasMailbox: true,
        needsAddress: false, // checked above
        leadCount,
        todayCount,
        laterCount: Math.max(0, leadCount - todayCount),
        capacity,
      },
    };
  }

  /** Campaign list with rolled-up counts. */
  async list(userId: string): Promise<CampaignSummary[]> {
    const admin = this.supabase.getAdminClient();
    const { data } = await admin
      .from('campaigns')
      .select('id,status,channel,created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    const campaigns = data ?? [];
    const out: CampaignSummary[] = [];
    for (const c of campaigns) {
      out.push({ ...c, counts: await this.counts(c.id) });
    }
    return out;
  }

  /** Full campaign monitor: per-lead step states + today's capacity. */
  async detail(userId: string, campaignId: string): Promise<CampaignDetail> {
    const admin = this.supabase.getAdminClient();
    const campaign = await admin
      .from('campaigns')
      .select('id,status,channel,created_at')
      .eq('id', campaignId)
      .eq('user_id', userId)
      .maybeSingle();
    if (!campaign.data) throw new NotFoundException('Campaign not found.');

    const msgs = await admin
      .from('messages')
      .select('id,lead_id,step_order,state,sent_at,send_error')
      .eq('campaign_id', campaignId)
      .order('step_order', { ascending: true });
    const leadIds = [...new Set((msgs.data ?? []).map((m) => m.lead_id))];
    const leads = await admin.from('leads').select('id,name,email').in('id', leadIds);
    const leadMeta = new Map((leads.data ?? []).map((l) => [l.id, l]));

    const byLead = new Map<string, CampaignStepState[]>();
    for (const m of msgs.data ?? []) {
      const list = byLead.get(m.lead_id) ?? [];
      list.push({ step_order: m.step_order, state: m.state, sent_at: m.sent_at, send_error: m.send_error });
      byLead.set(m.lead_id, list);
    }
    const leadStates: CampaignLeadState[] = leadIds.map((id) => ({
      leadId: id,
      name: leadMeta.get(id)?.name ?? null,
      email: leadMeta.get(id)?.email ?? null,
      steps: byLead.get(id) ?? [],
    }));

    return {
      ...campaign.data,
      counts: await this.counts(campaignId),
      leads: leadStates,
      capacity: await this.capacity.summary(userId),
    };
  }

  /** Pause or resume a campaign (and re-enqueue its queued first steps on resume). */
  async setStatus(userId: string, campaignId: string, status: 'paused' | 'active'): Promise<{ status: string }> {
    const admin = this.supabase.getAdminClient();
    const owned = await admin
      .from('campaigns')
      .select('id')
      .eq('id', campaignId)
      .eq('user_id', userId)
      .maybeSingle();
    if (!owned.data) throw new NotFoundException('Campaign not found.');

    await admin.from('campaigns').update({ status }).eq('id', campaignId);

    if (status === 'active' && this.queue) {
      // Re-enqueue the earliest queued step per lead so a paused campaign resumes.
      const queued = await admin
        .from('messages')
        .select('id,lead_id,step_order')
        .eq('campaign_id', campaignId)
        .eq('state', 'queued')
        .order('step_order', { ascending: true });
      const firstStepByLead = this.firstStepPerLead((queued.data as DraftMsg[]) ?? []);
      await this.queue.addBulk(
        firstStepByLead.map((messageId) => ({
          name: 'send',
          data: { userId, messageId },
          opts: { removeOnComplete: true, removeOnFail: 200, attempts: 1 },
        })),
      );
    }
    return { status };
  }

  async onModuleDestroy(): Promise<void> {
    await this.queue?.close();
  }

  // --- internals ---
  private async approvedDrafts(userId: string, listId: string): Promise<DraftMsg[]> {
    const admin = this.supabase.getAdminClient();
    const links = await admin.from('lead_list').select('lead_id').eq('list_id', listId);
    const leadIds = (links.data ?? []).map((r) => r.lead_id);
    if (leadIds.length === 0) return [];
    // Only the user's own leads' approved holding-area drafts (not yet in a campaign).
    const owned = await admin.from('leads').select('id').eq('user_id', userId).in('id', leadIds);
    const ownedIds = (owned.data ?? []).map((r) => r.id);
    if (ownedIds.length === 0) return [];
    const { data } = await admin
      .from('messages')
      .select('id,lead_id,step_order')
      .in('lead_id', ownedIds)
      .is('campaign_id', null)
      .eq('approved', true)
      .eq('state', 'queued')
      .order('step_order', { ascending: true });
    return (data as DraftMsg[]) ?? [];
  }

  private firstStepPerLead(drafts: DraftMsg[]): string[] {
    const firstByLead = new Map<string, DraftMsg>();
    for (const d of drafts) {
      const cur = firstByLead.get(d.lead_id);
      if (!cur || d.step_order < cur.step_order) firstByLead.set(d.lead_id, d);
    }
    return [...firstByLead.values()].map((d) => d.id);
  }

  private async counts(campaignId: string): Promise<CampaignSummary['counts']> {
    const { data } = await this.supabase
      .getAdminClient()
      .from('messages')
      .select('state')
      .eq('campaign_id', campaignId);
    const rows = data ?? [];
    const by = (s: string): number => rows.filter((r) => r.state === s).length;
    return {
      total: rows.length,
      sent: by('sent'),
      replied: by('replied'),
      bounced: by('bounced'),
      stopped: by('stopped'),
      queued: by('queued'),
    };
  }

  private async userMode(userId: string): Promise<'draft' | 'autonomous' | null> {
    const { data } = await this.supabase
      .getAdminClient()
      .from('users')
      .select('mode')
      .eq('id', userId)
      .maybeSingle();
    return (data?.mode as 'draft' | 'autonomous') ?? null;
  }

  private async assertOwnsList(userId: string, listId: string): Promise<void> {
    const { data } = await this.supabase
      .getAdminClient()
      .from('lists')
      .select('id')
      .eq('id', listId)
      .eq('user_id', userId)
      .maybeSingle();
    if (!data) throw new NotFoundException('List not found.');
  }
}
