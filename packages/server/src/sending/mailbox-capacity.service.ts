// MailboxCapacityService — per-inbox daily caps, warm-up ramp, and rotation.
//
// WHY: deliverability protection (master-context §2). Each connected mailbox has a
// daily cap; a `new` mailbox ramps up over days (warm-up). Sends are counted per
// mailbox per day in Redis (reset daily). Across a user's mailboxes we pick the one
// with the most remaining headroom (round-robin-ish rotation) to raise safe volume.
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CacheService } from '../cache/cache.service';
import { WARMUP_BASE, WARMUP_STEP_PER_DAY } from './sending.constants';
import type { Tables } from '@extrovertai/shared';

type MailboxRow = Tables<'mailboxes'>;

export interface MailboxCapacity {
  mailboxId: string;
  email: string;
  warmupState: string;
  effectiveCap: number;
  usedToday: number;
  remaining: number;
}

export interface CapacitySummary {
  connectedCount: number;
  totalCap: number;
  totalUsed: number;
  totalRemaining: number;
  mailboxes: MailboxCapacity[];
}

export type MailboxPick =
  | { ok: true; mailbox: MailboxRow; remaining: number }
  | { ok: false; reason: 'no_mailbox' | 'no_capacity' };

const COUNTER_TTL_SECONDS = 2 * 24 * 60 * 60;
const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class MailboxCapacityService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly cache: CacheService,
  ) {}

  /** Effective daily cap right now: the warm-up ramp for `new` mailboxes. */
  effectiveCap(mailbox: MailboxRow): number {
    if (mailbox.warmup_state !== 'new') return mailbox.daily_cap;
    const days = Math.max(0, Math.floor((Date.now() - Date.parse(mailbox.created_at)) / DAY_MS));
    const ramped = WARMUP_BASE + WARMUP_STEP_PER_DAY * days;
    return Math.min(mailbox.daily_cap, ramped);
  }

  async usedToday(mailboxId: string): Promise<number> {
    return this.cache.getInt(this.counterKey(mailboxId));
  }

  /** Record one send against a mailbox's daily counter. */
  async recordSend(mailboxId: string): Promise<void> {
    await this.cache.incr(this.counterKey(mailboxId), COUNTER_TTL_SECONDS);
  }

  /** A per-mailbox capacity breakdown for the campaign monitor / send plan. */
  async summary(userId: string): Promise<CapacitySummary> {
    const mailboxes = await this.connectedMailboxes(userId);
    const rows: MailboxCapacity[] = [];
    for (const m of mailboxes) {
      const effectiveCap = this.effectiveCap(m);
      const usedToday = await this.usedToday(m.id);
      rows.push({
        mailboxId: m.id,
        email: m.email,
        warmupState: m.warmup_state,
        effectiveCap,
        usedToday,
        remaining: Math.max(0, effectiveCap - usedToday),
      });
    }
    return {
      connectedCount: rows.length,
      totalCap: rows.reduce((s, r) => s + r.effectiveCap, 0),
      totalUsed: rows.reduce((s, r) => s + r.usedToday, 0),
      totalRemaining: rows.reduce((s, r) => s + r.remaining, 0),
      mailboxes: rows,
    };
  }

  /** Pick the mailbox with the most remaining headroom today (rotation). */
  async pick(userId: string): Promise<MailboxPick> {
    const mailboxes = await this.connectedMailboxes(userId);
    if (mailboxes.length === 0) return { ok: false, reason: 'no_mailbox' };

    let best: { mailbox: MailboxRow; remaining: number } | null = null;
    for (const m of mailboxes) {
      const remaining = this.effectiveCap(m) - (await this.usedToday(m.id));
      if (remaining > 0 && (!best || remaining > best.remaining)) {
        best = { mailbox: m, remaining };
      }
    }
    return best ? { ok: true, ...best } : { ok: false, reason: 'no_capacity' };
  }

  private async connectedMailboxes(userId: string): Promise<MailboxRow[]> {
    const { data } = await this.supabase
      .getAdminClient()
      .from('mailboxes')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'connected')
      .order('created_at', { ascending: true });
    return (data as MailboxRow[]) ?? [];
  }

  private counterKey(mailboxId: string): string {
    const day = new Date().toISOString().slice(0, 10); // UTC YYYY-MM-DD
    return `send:count:${mailboxId}:${day}`;
  }
}
