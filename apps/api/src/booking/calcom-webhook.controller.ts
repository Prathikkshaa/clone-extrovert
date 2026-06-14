// CalcomWebhookController — the public Cal.com booking webhook (File 13).
//
// WHY: when a lead books a meeting on the user's Cal.com, Cal.com POSTs us a webhook.
// This is how "meetings booked" becomes hands-off. Intentionally NOT auth-guarded (the
// caller is Cal.com, not a logged-in user) — trust comes from the HMAC signature, not a
// session. We verify the RAW body against CALCOM_WEBHOOK_SECRET and REJECT anything
// unsigned/invalid before parsing. The payload is untrusted DATA: we only record
// verified booking facts, never act on its contents.
//
// RAW BODY: signature verification must run on the exact bytes Cal.com signed, so the
// app is bootstrapped with `rawBody: true` (see main.ts) and we read `req.rawBody`
// rather than the JSON-parsed `@Body()` (key ordering/whitespace would change the hash).
import { Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { BookingService } from '@extrovertai/server';

// express's Request augmented with the raw body Nest captures when rawBody:true.
type RawRequest = Request & { rawBody?: Buffer };

@Controller('webhooks/calcom')
export class CalcomWebhookController {
  private readonly logger = new Logger(CalcomWebhookController.name);

  constructor(
    private readonly booking: BookingService,
    private readonly config: ConfigService,
  ) {}

  @Post()
  async receive(@Req() req: RawRequest, @Res() res: Response): Promise<void> {
    const secret = this.config.get<string>('CALCOM_WEBHOOK_SECRET') ?? '';
    if (!secret) {
      // Not configured yet — refuse rather than silently accepting unverifiable calls.
      this.logger.warn('Cal.com webhook hit but CALCOM_WEBHOOK_SECRET is not set — rejecting.');
      res.status(503).json({ ok: false, error: 'Booking webhook not configured.' });
      return;
    }

    const raw = req.rawBody?.toString('utf8') ?? '';
    const signature =
      this.header(req, 'x-cal-signature-256') ?? this.header(req, 'x-cal-signature');

    if (!this.booking.verifySignature(raw, signature, secret)) {
      // Unsigned or tampered — never trust it.
      this.logger.warn('Cal.com webhook rejected: invalid or missing signature.');
      res.status(401).json({ ok: false, error: 'Invalid signature.' });
      return;
    }

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      res.status(400).json({ ok: false, error: 'Malformed JSON.' });
      return;
    }

    try {
      const outcome = await this.booking.handleVerifiedWebhook(json);
      // Always 200 a verified, well-formed webhook so Cal.com doesn't retry — even when
      // we deliberately ignore the event (unknown trigger, no matching user, etc.).
      res.status(200).json({ ok: true, outcome });
    } catch (err) {
      // A handler crash IS worth a retry — return 500 so Cal.com re-delivers later.
      this.logger.error(`Cal.com webhook handling failed: ${(err as Error).message}`);
      res.status(500).json({ ok: false, error: 'Could not process booking.' });
    }
  }

  private header(req: Request, name: string): string | undefined {
    const value = req.headers[name];
    return Array.isArray(value) ? value[0] : value;
  }
}
