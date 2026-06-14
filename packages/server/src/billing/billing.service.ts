// BillingService — the credit ledger + metering core (master-context §6).
//
// Balance is ALWAYS sum(credit_ledger.delta); never a stored mutable value.
// Reserve/commit/refund are atomic and race-safe (Postgres functions with a
// per-user advisory lock). Reserve debits immediately; commit finalizes; refund
// appends a compensating credit (idempotent).
//
// ⚠️ MANDATORY PATH: every paid external action (Files 07/08/09/10) MUST run
// inside `withCreditGate(...)`. No paid external call may bypass the gate — that
// is how we guarantee we never charge for a failed call and never call without
// reserving first.
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  CREDIT_COSTS,
  CREDIT_DEBIT_ACTIONS,
  CreditReason,
  type CreditAction,
} from '@extrovertai/shared';
import { InsufficientCreditsError } from './billing.errors';

export interface LedgerEntry {
  delta: number;
  reason: string;
  ref_id: string | null;
  created_at: string;
}

export interface UsageSummary {
  windowDays: number;
  // Credits SPENT per debit action over the window (positive numbers).
  spendByAction: Record<CreditAction, number>;
  totalSpent: number;
  purchased: number; // credits bought in the window
  refunded: number; // credits returned in the window
  // Net ledger change over the window (= purchased − totalSpent + refunded). Proves
  // the breakdown ties out with the ledger (the same rows produce both).
  netChange: number;
}

// Cap the window scan so a very busy account can't load an unbounded set into memory.
const USAGE_SCAN_CAP = 5000;

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(private readonly supabase: SupabaseService) {}

  /** Current balance = SUM(delta) for the user. */
  async getBalance(userId: string): Promise<number> {
    const { data, error } = await this.supabase
      .getAdminClient()
      .rpc('credit_balance', { p_user: userId });
    if (error) {
      throw new Error(`Could not read balance: ${error.message}`);
    }
    return Number(data ?? 0);
  }

  /** Append a positive ledger entry (purchases in File 14; also used in tests). */
  async addCredits(
    userId: string,
    amount: number,
    reason: CreditReason = CreditReason.Purchase,
    refId: string | null = null,
  ): Promise<void> {
    const { error } = await this.supabase
      .getAdminClient()
      .from('credit_ledger')
      .insert({ user_id: userId, delta: amount, reason, ref_id: refId });
    if (error) {
      throw new Error(`Could not add credits: ${error.message}`);
    }
  }

  /** Atomically reserve credits for an action. Returns the usage_event id. */
  async reserve(
    userId: string,
    action: CreditAction,
    refId: string | null = null,
  ): Promise<string> {
    const cost = CREDIT_COSTS[action];
    const { data, error } = await this.supabase.getAdminClient().rpc('reserve_credits', {
      p_user: userId,
      p_action: action,
      p_cost: cost,
      p_ref: refId,
    });
    if (error) {
      if (error.message?.includes('INSUFFICIENT_CREDITS')) {
        throw new InsufficientCreditsError(userId, action, cost);
      }
      throw new Error(`Could not reserve credits: ${error.message}`);
    }
    return data as string;
  }

  /** Finalize a reserved usage_event. */
  async commit(usageEventId: string): Promise<void> {
    const { error } = await this.supabase
      .getAdminClient()
      .rpc('commit_usage', { p_usage: usageEventId });
    if (error) {
      throw new Error(`Could not commit usage: ${error.message}`);
    }
  }

  /** Refund a usage_event (idempotent — never double-credits). */
  async refund(usageEventId: string): Promise<void> {
    const { error } = await this.supabase
      .getAdminClient()
      .rpc('refund_usage', { p_usage: usageEventId });
    if (error) {
      throw new Error(`Could not refund usage: ${error.message}`);
    }
  }

  /** Recent ledger entries for the "where did my credits go" view. */
  async recentLedger(userId: string, limit = 10): Promise<LedgerEntry[]> {
    const { data, error } = await this.supabase
      .getAdminClient()
      .from('credit_ledger')
      .select('delta, reason, ref_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) {
      throw new Error(`Could not read ledger: ${error.message}`);
    }
    return data ?? [];
  }

  /**
   * Segregated usage over a window, computed FROM the ledger so it always ties out
   * with the balance (the same `credit_ledger` rows produce both). Answers "where did
   * my credits go?" — spend split by action type, plus purchases/refunds and the net
   * change (= purchased − spent + refunded). Scoped + capped by created_at.
   */
  async usageSummary(userId: string, days = 30): Promise<UsageSummary> {
    const windowDays = Number.isFinite(days) && days > 0 ? Math.min(365, Math.floor(days)) : 30;
    const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await this.supabase
      .getAdminClient()
      .from('credit_ledger')
      .select('delta, reason')
      .eq('user_id', userId)
      .gte('created_at', since)
      .limit(USAGE_SCAN_CAP);
    if (error) throw new Error(`Could not read usage: ${error.message}`);

    const spendByAction = Object.fromEntries(
      CREDIT_DEBIT_ACTIONS.map((a) => [a, 0]),
    ) as Record<CreditAction, number>;
    let totalSpent = 0;
    let purchased = 0;
    let refunded = 0;

    for (const row of data ?? []) {
      const reason = row.reason as string;
      const delta = Number(row.delta) || 0;
      if (reason === CreditReason.Purchase) {
        purchased += delta;
      } else if (reason === CreditReason.Refund) {
        refunded += delta;
      } else if ((CREDIT_DEBIT_ACTIONS as readonly string[]).includes(reason)) {
        // Debits are stored negative; surface spend as a positive number.
        const spent = Math.abs(delta);
        spendByAction[reason as CreditAction] += spent;
        totalSpent += spent;
      }
    }

    return {
      windowDays,
      spendByAction,
      totalSpent,
      purchased,
      refunded,
      netChange: purchased - totalSpent + refunded,
    };
  }

  /**
   * THE metering gate. Reserve → run the paid call → commit on success / refund
   * on failure. Throws InsufficientCreditsError BEFORE running `fn` when the user
   * can't afford it (so `fn` never runs). On `fn` failure the user is refunded and
   * the original error is rethrown (net-zero credit change).
   */
  async withCreditGate<T>(
    userId: string,
    action: CreditAction,
    refId: string | null,
    fn: () => Promise<T>,
  ): Promise<T> {
    const usageEventId = await this.reserve(userId, action, refId);
    try {
      const result = await fn();
      await this.commit(usageEventId);
      return result;
    } catch (err) {
      await this.refund(usageEventId);
      this.logger.warn(
        `Paid action "${action}" failed for ${userId}; refunded. Reason: ${(err as Error).message}`,
      );
      throw err;
    }
  }
}
