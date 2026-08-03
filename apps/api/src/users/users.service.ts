// UsersService — owns the app-profile (`users`) row.
//
// WHY: every authenticated user needs exactly one `users` row (the app profile
// that later files extend). This service creates it idempotently on first use,
// server-side via the admin client, scoped to the authenticated id.
//
// Defaults on creation: mode='draft' and daily_send_cap=50 come from the DB
// column defaults (see the initial migration); physical_address stays null until
// onboarding (File 05). 50/day is a conservative account-level ceiling — actual
// throttling/warm-up is enforced per-mailbox in File 10.
//
// SIGNUP BONUS: on first profile creation we grant `SIGNUP_CREDITS` starter
// credits (default 100) so a new account can use the paid actions (search/
// enrichment/draft) before Stripe top-up exists (File 14). Granted exactly once
// (only in the branch that actually created the row) and best-effort (a failed
// grant never blocks profile creation). Set SIGNUP_CREDITS=0 to disable.
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BillingService, SupabaseService } from '@extrovertai/server';
import { CreditReason, type Tables } from '@extrovertai/shared';

type UserProfile = Tables<'users'>;

const DEFAULT_SIGNUP_CREDITS = 100;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly billing: BillingService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Returns the user's profile row, creating it on first call. Idempotent:
   * concurrent first-requests never produce duplicates (id is the primary key).
   */
  async getOrCreateProfile(userId: string, email: string | null): Promise<UserProfile> {
    const admin = this.supabase.getAdminClient();

    const existing = await admin
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (existing.data) {
      return existing.data;
    }

    const inserted = await admin
      .from('users')
      .insert({ id: userId, email })
      .select('*')
      .single();

    if (!inserted.error && inserted.data) {
      // Brand-new account → grant starter credits exactly once (best-effort).
      await this.grantSignupBonus(userId);
      return inserted.data;
    }

    // Likely a concurrent insert won the race (duplicate PK) — re-read.
    const retry = await admin
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (retry.data) {
      return retry.data;
    }

    this.logger.error(
      `Failed to create profile for ${userId}: ${inserted.error?.message ?? 'unknown error'}`,
    );
    throw new InternalServerErrorException('Could not load or create your profile.');
  }

  /** Update the caller's profile settings (mailing address + send mode + booking link). */
  async updateProfile(
    userId: string,
    email: string | null,
    patch: {
      physical_address?: string;
      mode?: 'draft' | 'autonomous';
      booking_url?: string;
      email_signature?: string;
    },
  ): Promise<UserProfile> {
    await this.getOrCreateProfile(userId, email); // ensure the row exists
    const update: Partial<UserProfile> = {};
    if (patch.physical_address !== undefined) {
      update.physical_address = patch.physical_address.trim() || null;
    }
    if (patch.mode !== undefined) update.mode = patch.mode;
    if (patch.booking_url !== undefined) {
      update.booking_url = this.normalizeBookingUrl(patch.booking_url);
    }
    if (patch.email_signature !== undefined) {
      update.email_signature = patch.email_signature.trim() || null;
    }

    const { data, error } = await this.supabase
      .getAdminClient()
      .from('users')
      .update(update)
      .eq('id', userId)
      .select('*')
      .single();
    if (error || !data) {
      throw new InternalServerErrorException('Could not update your profile.');
    }
    return data;
  }

  /**
   * Normalize a pasted booking link: trim, drop to null when empty, add https:// when
   * the user pasted a bare host (e.g. "cal.com/me/30min"), and reject anything that
   * isn't an http(s) URL (we only ever surface a safe link in outreach).
   */
  private normalizeBookingUrl(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
      const url = new URL(withScheme);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
      return url.toString();
    } catch {
      return null;
    }
  }

  /** One-time starter credits for a brand-new account. Never blocks signup. */
  private async grantSignupBonus(userId: string): Promise<void> {
    const raw = this.config.get<string>('SIGNUP_CREDITS');
    const amount = raw === undefined ? DEFAULT_SIGNUP_CREDITS : Number(raw);
    if (!Number.isFinite(amount) || amount <= 0) return;
    try {
      // ref_id is a uuid column (references an action id); a signup bonus has no
      // such id, so it stays null. The `purchase` reason marks it as granted credit.
      await this.billing.addCredits(userId, amount, CreditReason.Purchase, null);
      this.logger.log(`Granted ${amount} signup credits to ${userId}.`);
    } catch (err) {
      // Best-effort: a failed grant must not break profile creation / login.
      this.logger.warn(`Signup credit grant failed for ${userId}: ${(err as Error).message}`);
    }
  }
}
