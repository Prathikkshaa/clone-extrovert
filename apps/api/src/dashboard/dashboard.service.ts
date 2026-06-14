// DashboardService — trustworthy outreach metrics + deliverability health (File 12).
//
// WHY: answer one question at a glance — "is my outreach working, and what needs my
// attention?" We LEAD with money-linked, reliable signals (meetings, replies, clicks)
// and demote unreliable ones (opens are NOT tracked — shown honestly as such, §2/§4).
//
// PERFORMANCE (build §2): the headline summary never loads event/message rows into
// memory — every number is a COUNT query (`head: true`, `count: 'exact'`) scoped by
// `user_id` + a `created_at`/`sent_at` window, hitting the per-user+created_at indexes
// (`idx_*_events_user_created`) and the leads/messages indexes. So page load cost is a
// handful of counts, independent of how many messages a user has sent.
import { Injectable, Logger } from '@nestjs/common';
import { BillingService, MailboxCapacityService, SupabaseService } from '@extrovertai/server';

// The admin Supabase client type, derived from the service so apps/api needn't import
// `@supabase/supabase-js` directly (it's a transitive dep of @extrovertai/server).
type Admin = ReturnType<SupabaseService['getAdminClient']>;

export type HealthStatus = 'healthy' | 'warning' | 'danger';

export interface DeliverabilityHealth {
  // Today's send volume vs the safe cap (warm-up aware) — framed as protection.
  volumeUsed: number;
  volumeCap: number;
  // Rates over the window. complaintRate is null = not available from our providers yet.
  bounceRate: number; // 0..1
  complaintRate: number | null;
  status: HealthStatus;
  // Thresholds we judged against (documented + surfaced for honesty).
  thresholds: { bounceWarning: number; bounceDanger: number };
}

export interface DashboardSummary {
  windowDays: number;
  // 1) The goal + the reliable engagement signals.
  meetingsBooked: number;
  positiveReplies: number;
  totalReplies: number;
  // 2) Activity.
  emailsSent: number;
  followUpsPending: number;
  bounces: number;
  // 3) Trustworthy engagement.
  linkClicks: number;
  // 4) Opens — deliberately last + honest. We do NOT run an open pixel, so this is
  // not a real number; the UI shows it muted as "not tracked (unreliable)".
  opens: { tracked: false };
  // Deliverability protection.
  health: DeliverabilityHealth;
  // Credits (top-up affordance lives in the UI; full billing is File 14).
  creditBalance: number;
  // True when there's nothing to show yet → the UI teaches the next action.
  isEmpty: boolean;
}

export interface CampaignStat {
  campaignId: string;
  name: string | null;
  status: string;
  sent: number;
  linkClicks: number;
  replies: number;
  bounces: number;
  meetings: number;
}

export interface LeadStat {
  leadId: string;
  name: string | null;
  email: string | null;
  status: string;
  sent: number;
  clicks: number;
  replied: boolean;
  bounced: boolean;
  booked: boolean;
}

// Bounce-rate thresholds (documented): mailbox providers start throttling/blocking as
// bounce rate climbs. Stay well under 5%. We flag warning at 2%, danger at 5%.
const BOUNCE_WARNING = 0.02;
const BOUNCE_DANGER = 0.05;
const DEFAULT_WINDOW_DAYS = 30;

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly billing: BillingService,
    private readonly capacity: MailboxCapacityService,
  ) {}

  async summary(userId: string, days = DEFAULT_WINDOW_DAYS): Promise<DashboardSummary> {
    const windowDays = this.normalizeWindow(days);
    const since = this.sinceIso(windowDays);
    const admin = this.supabase.getAdminClient();

    // All counts run in parallel — each is a single COUNT, no row materialization.
    const [
      meetingsBooked,
      positiveReplies,
      totalReplies,
      emailsSent,
      followUpsPending,
      bounces,
      linkClicks,
      capacitySummary,
      creditBalance,
    ] = await Promise.all([
      this.countEvents(admin, 'booking_events', userId, since),
      this.countPositiveReplies(admin, userId, since),
      this.countEvents(admin, 'reply_events', userId, since),
      this.countSentEmails(admin, userId, since),
      this.countFollowUpsPending(admin, userId),
      this.countEvents(admin, 'bounce_events', userId, since),
      this.countEvents(admin, 'click_events', userId, since),
      this.capacity.summary(userId),
      this.safeBalance(userId),
    ]);

    const bounceRate = emailsSent > 0 ? bounces / emailsSent : 0;
    const health: DeliverabilityHealth = {
      volumeUsed: capacitySummary.totalUsed,
      volumeCap: capacitySummary.totalCap,
      bounceRate,
      complaintRate: null,
      status: this.healthStatus(bounceRate, capacitySummary.connectedCount),
      thresholds: { bounceWarning: BOUNCE_WARNING, bounceDanger: BOUNCE_DANGER },
    };

    const isEmpty =
      emailsSent === 0 &&
      totalReplies === 0 &&
      linkClicks === 0 &&
      meetingsBooked === 0 &&
      followUpsPending === 0;

    return {
      windowDays,
      meetingsBooked,
      positiveReplies,
      totalReplies,
      emailsSent,
      followUpsPending,
      bounces,
      linkClicks,
      opens: { tracked: false },
      health,
      creditBalance,
      isEmpty,
    };
  }

  /** Per-campaign drill-down (below the fold; on-demand). */
  async campaigns(userId: string, days = DEFAULT_WINDOW_DAYS): Promise<CampaignStat[]> {
    const windowDays = this.normalizeWindow(days);
    const since = this.sinceIso(windowDays);
    const admin = this.supabase.getAdminClient();

    const { data: campaigns } = await admin
      .from('campaigns')
      .select('id,status,list_id,created_at,lists(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const stats: CampaignStat[] = [];
    for (const c of campaigns ?? []) {
      const [sent, linkClicks, replies, bounces, meetings] = await Promise.all([
        this.countSentEmails(admin, userId, since, c.id),
        this.countEventsForCampaign(admin, 'click_events', userId, since, c.id),
        this.countEventsForCampaign(admin, 'reply_events', userId, since, c.id),
        this.countEventsForCampaign(admin, 'bounce_events', userId, since, c.id),
        this.countEventsForCampaign(admin, 'booking_events', userId, since, c.id),
      ]);
      const listName = (c as { lists?: { name?: string | null } | null }).lists?.name ?? null;
      stats.push({
        campaignId: c.id,
        name: listName,
        status: c.status,
        sent,
        linkClicks,
        replies,
        bounces,
        meetings,
      });
    }
    return stats;
  }

  /** Per-lead drill-down for one campaign (bounded to that campaign's leads). */
  async campaignLeads(userId: string, campaignId: string): Promise<LeadStat[]> {
    const admin = this.supabase.getAdminClient();
    // Ownership check + the campaign's messages (its leads + sent counts).
    const { data: campaign } = await admin
      .from('campaigns')
      .select('id')
      .eq('id', campaignId)
      .eq('user_id', userId)
      .maybeSingle();
    if (!campaign) return [];

    const { data: msgs } = await admin
      .from('messages')
      .select('lead_id,state,direction')
      .eq('campaign_id', campaignId);

    const leadIds = [...new Set((msgs ?? []).map((m) => m.lead_id).filter(Boolean))] as string[];
    if (leadIds.length === 0) return [];

    const [{ data: leads }, { data: clicks }, { data: replies }, { data: bounces }, { data: bookings }] =
      await Promise.all([
        admin.from('leads').select('id,name,email,status').in('id', leadIds),
        admin.from('click_events').select('lead_id').eq('user_id', userId).in('lead_id', leadIds),
        admin.from('reply_events').select('lead_id').eq('user_id', userId).in('lead_id', leadIds),
        admin.from('bounce_events').select('lead_id').eq('user_id', userId).in('lead_id', leadIds),
        admin.from('booking_events').select('lead_id').eq('user_id', userId).in('lead_id', leadIds),
      ]);

    const sentByLead = new Map<string, number>();
    for (const m of msgs ?? []) {
      if (m.direction === 'outbound' && m.state === 'sent' && m.lead_id) {
        sentByLead.set(m.lead_id, (sentByLead.get(m.lead_id) ?? 0) + 1);
      }
    }
    const clicksByLead = this.tally(clicks);
    const repliedSet = this.idSet(replies);
    const bouncedSet = this.idSet(bounces);
    const bookedSet = this.idSet(bookings);

    return (leads ?? []).map((l) => ({
      leadId: l.id,
      name: l.name,
      email: l.email,
      status: l.status,
      sent: sentByLead.get(l.id) ?? 0,
      clicks: clicksByLead.get(l.id) ?? 0,
      replied: repliedSet.has(l.id),
      bounced: bouncedSet.has(l.id),
      booked: bookedSet.has(l.id),
    }));
  }

  // --- count helpers (COUNT only — no row materialization) ---

  /** Count rows in a tracking-event table for a user within the window. */
  private async countEvents(
    admin: Admin,
    table: 'click_events' | 'reply_events' | 'bounce_events' | 'booking_events',
    userId: string,
    since: string,
  ): Promise<number> {
    const { count, error } = await admin
      .from(table)
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', since);
    if (error) {
      this.logger.warn(`count ${table} failed: ${error.message}`);
      return 0;
    }
    return count ?? 0;
  }

  /** Replies labelled "positive" — filter pushed down to Postgres (no in-memory scan). */
  private async countPositiveReplies(admin: Admin, userId: string, since: string): Promise<number> {
    const { count, error } = await admin
      .from('reply_events')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', since)
      .filter('payload->>label', 'eq', 'positive');
    if (error) {
      this.logger.warn(`count positive replies failed: ${error.message}`);
      return 0;
    }
    return count ?? 0;
  }

  /**
   * Emails sent within the window. `messages` has no user_id, so we filter through an
   * INNER join on the owning lead (`leads!inner(user_id)`) — PostgREST pushes this to a
   * single counted query against the messages/leads indexes (no rows loaded).
   */
  private async countSentEmails(
    admin: Admin,
    userId: string,
    since: string,
    campaignId?: string,
  ): Promise<number> {
    let q = admin
      .from('messages')
      .select('id,leads!inner(user_id)', { count: 'exact', head: true })
      .eq('leads.user_id', userId)
      .eq('direction', 'outbound')
      .eq('state', 'sent')
      .gte('sent_at', since);
    if (campaignId) q = q.eq('campaign_id', campaignId);
    const { count, error } = await q;
    if (error) {
      this.logger.warn(`count sent emails failed: ${error.message}`);
      return 0;
    }
    return count ?? 0;
  }

  /** Queued follow-up steps (step_order > 1) still pending across active campaigns. */
  private async countFollowUpsPending(admin: Admin, userId: string): Promise<number> {
    const { count, error } = await admin
      .from('messages')
      .select('id,leads!inner(user_id)', { count: 'exact', head: true })
      .eq('leads.user_id', userId)
      .eq('state', 'queued')
      .not('campaign_id', 'is', null)
      .gt('step_order', 1);
    if (error) {
      this.logger.warn(`count follow-ups pending failed: ${error.message}`);
      return 0;
    }
    return count ?? 0;
  }

  /** Event count constrained to one campaign's leads (drill-down). */
  private async countEventsForCampaign(
    admin: Admin,
    table: 'click_events' | 'reply_events' | 'bounce_events' | 'booking_events',
    userId: string,
    since: string,
    campaignId: string,
  ): Promise<number> {
    const leadIds = await this.campaignLeadIds(admin, campaignId);
    if (leadIds.length === 0) return 0;
    const { count, error } = await admin
      .from(table)
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', since)
      .in('lead_id', leadIds);
    if (error) {
      this.logger.warn(`count ${table} for campaign failed: ${error.message}`);
      return 0;
    }
    return count ?? 0;
  }

  private async campaignLeadIds(admin: Admin, campaignId: string): Promise<string[]> {
    const { data } = await admin
      .from('messages')
      .select('lead_id')
      .eq('campaign_id', campaignId);
    return [...new Set((data ?? []).map((m) => m.lead_id).filter(Boolean))] as string[];
  }

  // --- small utilities ---
  private healthStatus(bounceRate: number, connectedMailboxes: number): HealthStatus {
    if (connectedMailboxes === 0) return 'warning'; // nothing connected = can't send
    if (bounceRate >= BOUNCE_DANGER) return 'danger';
    if (bounceRate >= BOUNCE_WARNING) return 'warning';
    return 'healthy';
  }

  private tally(rows: { lead_id: string | null }[] | null): Map<string, number> {
    const m = new Map<string, number>();
    for (const r of rows ?? []) {
      if (r.lead_id) m.set(r.lead_id, (m.get(r.lead_id) ?? 0) + 1);
    }
    return m;
  }

  private idSet(rows: { lead_id: string | null }[] | null): Set<string> {
    return new Set((rows ?? []).map((r) => r.lead_id).filter(Boolean) as string[]);
  }

  private async safeBalance(userId: string): Promise<number> {
    try {
      return await this.billing.getBalance(userId);
    } catch (err) {
      this.logger.warn(`balance read failed: ${(err as Error).message}`);
      return 0;
    }
  }

  private normalizeWindow(days: number): number {
    if (!Number.isFinite(days) || days <= 0) return DEFAULT_WINDOW_DAYS;
    return Math.min(365, Math.floor(days));
  }

  private sinceIso(days: number): string {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  }
}
