// StripeService — the single provider for everything Stripe (master-context §10).
//
// WHY a separate service from BillingService: BillingService owns the credit LEDGER
// (balance/reserve/commit/refund). StripeService owns the external STRIPE API (the
// only place the secret key + SDK live, backend-only). Money flows one way:
// Stripe webhook → StripeService verifies + resolves the grant → BillingService.addCredits.
//
// SAFETY:
//  - Stripe-hosted Checkout only — we NEVER see card data.
//  - Credits are granted ONLY from the signature-VERIFIED webhook, never the browser
//    redirect (the redirect isn't proof money moved, §6).
//  - Idempotency is keyed off the Stripe EVENT id (stripe_events PK): a re-delivered
//    event is a no-op, so a purchase is never double-credited.
//  - "Not configured" is a first-class state: with no STRIPE_SECRET_KEY the service
//    stays dormant (no client) so the app builds + runs before keys are pasted.
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { SupabaseService } from '../supabase/supabase.service';
import { BillingService } from '../billing/billing.service';
import {
  CREDIT_PACKS,
  CreditReason,
  findCreditPack,
  type CreditPack,
} from '@extrovertai/shared';
import { checkoutMetadata, extractGrant } from './stripe.util';

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; reason: 'not_configured' | 'unknown_pack' | 'error'; message: string };

export type WebhookResult =
  | { ok: true; outcome: 'granted' | 'duplicate' | 'ignored'; credits?: number }
  | { ok: false; reason: 'not_configured' | 'bad_signature' | 'error'; message: string };

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  // InstanceType<typeof Stripe> rather than `Stripe` as a type — the SDK merges a
  // class + namespace under the default export, so the bare name isn't a usable type.
  private readonly client: InstanceType<typeof Stripe> | null;
  private readonly webhookSecret: string;

  constructor(
    private readonly config: ConfigService,
    private readonly supabase: SupabaseService,
    private readonly billing: BillingService,
  ) {
    const key = this.config.get<string>('STRIPE_SECRET_KEY') ?? '';
    // Lazy: no key → no client (the app builds + runs before keys are pasted). The SDK
    // pins its own default API version, which is what we want for forward-compat.
    this.client = key ? new Stripe(key) : null;
    this.webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET') ?? '';
  }

  /** True once the Stripe secret key is configured (gates the buy buttons in the UI). */
  isConfigured(): boolean {
    return this.client !== null;
  }

  /** The buyable packs (catalogue from shared constants). */
  packs(): readonly CreditPack[] {
    return CREDIT_PACKS;
  }

  /**
   * Create a Stripe-hosted Checkout Session for one pack and return its URL. We attach
   * `client_reference_id` + metadata (userId/packId/credits) so the webhook can resolve
   * the grant; the price is built inline from the pack so no Stripe dashboard product
   * setup is required.
   */
  async createCheckout(userId: string, packId: string, returnBaseUrl: string): Promise<CheckoutResult> {
    if (!this.client) {
      return { ok: false, reason: 'not_configured', message: 'Billing is not set up yet.' };
    }
    const pack = findCreditPack(packId);
    if (!pack) return { ok: false, reason: 'unknown_pack', message: 'Unknown credit pack.' };

    const base = returnBaseUrl.replace(/\/$/, '');
    try {
      const session = await this.client.checkout.sessions.create({
        mode: 'payment',
        client_reference_id: userId,
        metadata: checkoutMetadata(userId, pack.id),
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'usd',
              unit_amount: pack.priceUsdCents,
              product_data: {
                name: `${pack.label} — ${pack.credits} credits`,
                description: `${pack.credits} ExtrovertAI credits`,
              },
            },
          },
        ],
        // Stripe replaces {CHECKOUT_SESSION_ID}; we land back on the billing screen.
        success_url: `${base}/billing?status=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/billing?status=cancelled`,
      });
      if (!session.url) {
        return { ok: false, reason: 'error', message: 'Stripe did not return a checkout URL.' };
      }
      return { ok: true, url: session.url };
    } catch (err) {
      this.logger.error(`Stripe checkout create failed: ${(err as Error).message}`);
      return { ok: false, reason: 'error', message: 'Could not start checkout. Please try again.' };
    }
  }

  /**
   * Handle a raw Stripe webhook: verify the signature against STRIPE_WEBHOOK_SECRET,
   * then — for a paid checkout/invoice — grant credits ONCE (idempotent on the event
   * id). Returns a structured result so the controller can pick the HTTP status.
   */
  async handleWebhook(rawBody: string, signature: string | undefined): Promise<WebhookResult> {
    if (!this.client || !this.webhookSecret) {
      return { ok: false, reason: 'not_configured', message: 'Billing webhook not configured.' };
    }

    const event = this.verifyEvent(this.client, rawBody, signature);
    if (!event) {
      // Signature mismatch / malformed — never trust it.
      return { ok: false, reason: 'bad_signature', message: 'Invalid signature.' };
    }

    // Stripe types data.object as a wide union; extractGrant reads it as plain data.
    const grant = extractGrant(event as unknown as { data?: { object?: Record<string, unknown> }; id?: unknown; type?: unknown });
    if (!grant) {
      // A verified event we don't grant on (or can't resolve) — ack so Stripe stops.
      return { ok: true, outcome: 'ignored' };
    }

    // Idempotency gate: the event id is the PK. Insert-if-absent; a duplicate delivery
    // collides → we skip the grant. We record FIRST, then grant, and roll the record
    // back if the grant fails so Stripe's retry can re-process.
    const claimed = await this.claimEvent(event.id, event.type, grant.userId, grant.credits);
    if (!claimed) return { ok: true, outcome: 'duplicate', credits: grant.credits };

    try {
      // ref_id is a uuid column and a Stripe event id is not a uuid, so it stays null;
      // stripe_events holds the event→grant linkage for reconciliation.
      await this.billing.addCredits(grant.userId, grant.credits, CreditReason.Purchase, null);
      this.logger.log(`Granted ${grant.credits} credits to ${grant.userId} (event ${event.id}).`);
      return { ok: true, outcome: 'granted', credits: grant.credits };
    } catch (err) {
      // Grant failed → release the idempotency claim so a retry re-grants (no lost credits).
      await this.releaseEvent(event.id);
      this.logger.error(`Credit grant failed for event ${event.id}: ${(err as Error).message}`);
      return { ok: false, reason: 'error', message: 'Could not grant credits.' };
    }
  }

  /** Verify + decode the event; null on a bad/forged signature. Return type inferred. */
  private verifyEvent(client: InstanceType<typeof Stripe>, rawBody: string, signature: string | undefined) {
    try {
      return client.webhooks.constructEvent(rawBody, signature ?? '', this.webhookSecret);
    } catch (err) {
      this.logger.warn(`Stripe webhook rejected: ${(err as Error).message}`);
      return null;
    }
  }

  // --- idempotency record ---

  /** Insert the event row; returns false if it already existed (duplicate delivery). */
  private async claimEvent(
    id: string,
    type: string,
    userId: string,
    credits: number,
  ): Promise<boolean> {
    const { error } = await this.supabase
      .getAdminClient()
      .from('stripe_events')
      .insert({ id, type, user_id: userId, credits });
    if (!error) return true;
    if (error.code === '23505' || error.message.toLowerCase().includes('duplicate')) {
      return false; // already processed
    }
    // Unexpected DB error — surface as not-claimed so we don't grant without a record.
    this.logger.error(`stripe_events claim failed for ${id}: ${error.message}`);
    return false;
  }

  /** Remove an event claim so a Stripe retry can re-process it (grant rollback). */
  private async releaseEvent(id: string): Promise<void> {
    await this.supabase.getAdminClient().from('stripe_events').delete().eq('id', id);
  }
}
