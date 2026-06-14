// ClickTrackingService — wrap outbound links so clicks become a trustworthy signal.
//
// WHY: open tracking is unreliable (master-context §2), but a LINK CLICK is a real,
// intentional engagement signal. At send time we rewrite every http(s) link in the
// email body to point at our own redirect endpoint (`GET /r/:token`). When the
// recipient clicks, we record a `click_events` row and 302 them to the real URL —
// invisible to them, honest for the user. The token is HMAC-signed (same backend
// secret as the unsubscribe token) so it can't be forged or tampered with.
//
// IMPORTANT: wrapping runs in the shared pre-send step BEFORE the compliance footer
// is appended (SendingService), so the unsubscribe link itself is never wrapped — an
// unsubscribe is a compliance action, not an engagement click, and its token must
// reach the real endpoint untouched.
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { SupabaseService } from '../supabase/supabase.service';
import type { Json } from '@extrovertai/shared';

export interface ClickContext {
  userId: string;
  leadId: string;
  messageId: string;
}

interface ClickPayload {
  u: string; // user id
  l: string; // lead id
  m: string; // message id
  url: string; // the real destination
}

// http(s) URLs in a plaintext body. We stop at whitespace and a few delimiters so we
// don't swallow trailing punctuation / closing brackets that aren't part of the URL.
const URL_RE = /https?:\/\/[^\s<>()"']+/g;
// Characters that are commonly sentence punctuation right after a URL, not part of it.
const TRAILING_PUNCT = /[.,;:!?)\]}>'"]+$/;

@Injectable()
export class ClickTrackingService {
  private readonly logger = new Logger(ClickTrackingService.name);
  private readonly secret: Buffer;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly config: ConfigService,
  ) {
    this.secret = Buffer.from(this.config.get<string>('TOKEN_ENCRYPTION_KEY') ?? '', 'base64');
  }

  /**
   * Rewrite every http(s) link in a plaintext body to a tracked redirect URL.
   * Pure + synchronous (no DB) so it slots into the hot send path cheaply.
   */
  wrapLinks(ctx: ClickContext, body: string): string {
    if (!body) return body;
    return body.replace(URL_RE, (match) => {
      // Peel trailing punctuation off the captured URL and re-append it after the swap.
      const trailing = match.match(TRAILING_PUNCT)?.[0] ?? '';
      const url = trailing ? match.slice(0, match.length - trailing.length) : match;
      if (!url) return match;
      const token = this.signClick({ u: ctx.userId, l: ctx.leadId, m: ctx.messageId, url });
      return `${this.apiBaseUrl()}/r/${token}${trailing}`;
    });
  }

  /** Verify a click token; returns the payload (incl. the real URL) or null if invalid. */
  verifyClick(token: string): ClickPayload | null {
    const [body, sig] = token.split('.');
    if (!body || !sig) return null;
    const expected = this.hmac(body);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    try {
      const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as ClickPayload;
      // Only ever redirect to http(s) — never an arbitrary scheme (open-redirect guard).
      if (!/^https?:\/\//i.test(payload.url)) return null;
      return payload;
    } catch {
      return null;
    }
  }

  /** Record one click (best-effort — a tracking failure must never block the redirect). */
  async recordClick(payload: ClickPayload): Promise<void> {
    try {
      await this.supabase
        .getAdminClient()
        .from('click_events')
        .insert({
          user_id: payload.u,
          lead_id: payload.l || null,
          message_id: payload.m || null,
          payload: { url: payload.url } as unknown as Json,
        });
    } catch (err) {
      this.logger.warn(`Click record failed: ${(err as Error).message}`);
    }
  }

  // --- internals ---
  private signClick(payload: ClickPayload): string {
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return `${body}.${this.hmac(body)}`;
  }

  private hmac(body: string): string {
    return createHmac('sha256', this.secret).update(body).digest('base64url');
  }

  /** Public base URL the redirect link must be reachable at. Prod uses a tunnel. */
  private apiBaseUrl(): string {
    const explicit = this.config.get<string>('PUBLIC_API_URL');
    if (explicit) return explicit.replace(/\/$/, '');
    const port = this.config.get<string>('API_PORT') ?? '3000';
    return `http://localhost:${port}`;
  }
}
