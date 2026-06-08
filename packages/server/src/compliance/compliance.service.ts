// ComplianceService — the NON-REMOVABLE compliance layer (master-context §2).
//
// WHY: every cold email must legally carry a working unsubscribe link + the
// sender's physical address, and we must NEVER send to a suppressed address. This
// is the ONE shared guard every send path (File 10 campaign sends AND File 11
// reply sends) calls — no send may bypass it. Suppression is honored immediately
// (unsubscribe click, unsubscribe-reply, hard bounce all funnel here).
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { SupabaseService } from '../supabase/supabase.service';
import { SuppressionReason } from '@extrovertai/shared';

export type ComplianceResult =
  | { ok: true; body: string }
  | { ok: false; reason: 'no_address' };

interface UnsubPayload {
  u: string; // user id
  l: string; // lead id
  e: string; // recipient email
}

@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);
  private readonly secret: Buffer;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly config: ConfigService,
  ) {
    // Reuse the backend secret to sign unsubscribe tokens (32 bytes, base64).
    this.secret = Buffer.from(this.config.get<string>('TOKEN_ENCRYPTION_KEY') ?? '', 'base64');
  }

  /** True if this address is suppressed for this user (checked before EVERY send). */
  async isSuppressed(userId: string, email: string): Promise<boolean> {
    const { data } = await this.supabase
      .getAdminClient()
      .from('suppressions')
      .select('id')
      .eq('user_id', userId)
      .eq('email', email.toLowerCase())
      .maybeSingle();
    return Boolean(data);
  }

  /** Add an address to the suppression list (idempotent). Honored immediately. */
  async suppress(userId: string, email: string, reason: SuppressionReason): Promise<void> {
    const addr = email.toLowerCase();
    if (await this.isSuppressed(userId, addr)) return;
    const { error } = await this.supabase
      .getAdminClient()
      .from('suppressions')
      .insert({ user_id: userId, email: addr, reason });
    if (error && !error.message.includes('duplicate')) {
      this.logger.warn(`Suppress failed for ${addr}: ${error.message}`);
    }
  }

  /**
   * Append the legally-required footer (unsubscribe link + physical address) to an
   * outbound body. Blocks (no_address) if the sender hasn't set a mailing address —
   * we never send a non-compliant email.
   */
  async applyCompliance(
    userId: string,
    leadId: string,
    email: string,
    body: string,
  ): Promise<ComplianceResult> {
    const address = await this.physicalAddress(userId);
    if (!address) return { ok: false, reason: 'no_address' };

    const url = this.unsubscribeUrl(userId, leadId, email);
    const footer = `\n\n--\n${address}\n\nDon't want these emails? Unsubscribe: ${url}`;
    return { ok: true, body: `${body}${footer}` };
  }

  /** Build the tokenized, login-free unsubscribe URL for a recipient. */
  unsubscribeUrl(userId: string, leadId: string, email: string): string {
    const token = this.signUnsub({ u: userId, l: leadId, e: email.toLowerCase() });
    return `${this.apiBaseUrl()}/unsubscribe/${token}`;
  }

  /** Verify an unsubscribe token; returns the payload or null if invalid. */
  verifyUnsub(token: string): UnsubPayload | null {
    const [body, sig] = token.split('.');
    if (!body || !sig) return null;
    const expected = this.hmac(body);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    try {
      return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as UnsubPayload;
    } catch {
      return null;
    }
  }

  async physicalAddress(userId: string): Promise<string | null> {
    const { data } = await this.supabase
      .getAdminClient()
      .from('users')
      .select('physical_address')
      .eq('id', userId)
      .maybeSingle();
    const addr = (data?.physical_address ?? '').trim();
    return addr || null;
  }

  // --- internals ---
  private signUnsub(payload: UnsubPayload): string {
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return `${body}.${this.hmac(body)}`;
  }

  private hmac(body: string): string {
    return createHmac('sha256', this.secret).update(body).digest('base64url');
  }

  /** Public base URL the unsubscribe link must be reachable at. Prod uses a tunnel. */
  private apiBaseUrl(): string {
    const explicit = this.config.get<string>('PUBLIC_API_URL');
    if (explicit) return explicit.replace(/\/$/, '');
    const port = this.config.get<string>('API_PORT') ?? '3000';
    return `http://localhost:${port}`;
  }
}
