// StripeWebhookController — the public Stripe payment webhook (File 14).
//
// WHY: credits are granted ONLY here, from a signature-VERIFIED event — never from
// the browser success redirect (the redirect isn't proof money moved, and the user
// closing the tab must not lose credits). Intentionally NOT auth-guarded (the caller
// is Stripe); trust comes from the HMAC signature, verified against STRIPE_WEBHOOK_SECRET.
//
// RAW BODY: Stripe's signature is over the exact bytes, so we read `req.rawBody`
// (app bootstrapped with rawBody:true in main.ts) — a re-serialized JSON body would
// fail verification. The payload is untrusted DATA: we only act on verified facts.
import { Controller, Logger, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { StripeService } from '@extrovertai/server';

type RawRequest = Request & { rawBody?: Buffer };

@Controller('webhooks/stripe')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(private readonly stripe: StripeService) {}

  @Post()
  async receive(@Req() req: RawRequest, @Res() res: Response): Promise<void> {
    const raw = req.rawBody?.toString('utf8') ?? '';
    const signature = this.header(req, 'stripe-signature');

    const result = await this.stripe.handleWebhook(raw, signature);

    if (result.ok) {
      // Ack verified events (granted/duplicate/ignored) with 200 so Stripe stops retrying.
      res.status(200).json({ received: true, outcome: result.outcome });
      return;
    }

    switch (result.reason) {
      case 'not_configured':
        // Not wired up yet — 503 so Stripe retries later (once the secret is set).
        res.status(503).json({ received: false, error: result.message });
        return;
      case 'bad_signature':
        res.status(400).json({ received: false, error: result.message });
        return;
      default:
        // Grant failed after a valid signature → 500 invites a Stripe retry (we rolled
        // back the idempotency claim, so the retry will re-grant cleanly).
        this.logger.error(`Stripe webhook processing error: ${result.message}`);
        res.status(500).json({ received: false, error: result.message });
        return;
    }
  }

  private header(req: Request, name: string): string | undefined {
    const value = req.headers[name];
    return Array.isArray(value) ? value[0] : value;
  }
}
