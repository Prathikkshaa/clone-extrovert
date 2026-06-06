// SupabaseService — backend access to Supabase Postgres.
// WHY: a single injectable provider for the *admin* (service_role) client used by
// the API and worker. Routing all DB access through one provider keeps it
// swappable and rate-limitable (master-context §10).
//
// SECURITY: the service_role key bypasses Row-Level Security and must NEVER reach
// the browser. This service lives in @extrovertai/server (backend-only) and is
// never imported by apps/web. Even though service_role can see every row, backend
// code MUST still scope queries by user_id itself — defense in depth (§02.3).
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@extrovertai/shared';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private readonly adminClient: SupabaseClient<Database>;

  constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('SUPABASE_URL');
    const serviceRoleKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !serviceRoleKey) {
      throw new Error(
        'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for the backend Supabase client.',
      );
    }

    this.adminClient = createClient<Database>(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    this.logger.log('Supabase admin client initialized');
  }

  /**
   * Admin client backed by the service_role key. Bypasses RLS — backend only.
   * NEVER expose this client or its key to the frontend.
   */
  getAdminClient(): SupabaseClient<Database> {
    return this.adminClient;
  }
}
