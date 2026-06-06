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
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { SupabaseService } from '@extrovertai/server';
import type { Tables } from '@extrovertai/shared';

type UserProfile = Tables<'users'>;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly supabase: SupabaseService) {}

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
}
