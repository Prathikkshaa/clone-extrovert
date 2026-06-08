// UnsubscribeController — the public, login-free unsubscribe endpoint (File 11).
//
// WHY: every cold email carries a tokenized unsubscribe link. Clicking it must work
// with NO login and be honored IMMEDIATELY (compliance, §2). The HMAC-signed token
// identifies the user + lead + address; we add the address to `suppressions` and
// stop that lead's remaining queued sends, then show a plain confirmation page.
// Intentionally NOT behind the auth guard (the recipient is not a logged-in user).
import { Controller, Get, Logger, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ComplianceService, SupabaseService } from '@extrovertai/server';
import { SuppressionReason } from '@extrovertai/shared';

@Controller('unsubscribe')
export class UnsubscribeController {
  private readonly logger = new Logger(UnsubscribeController.name);

  constructor(
    private readonly compliance: ComplianceService,
    private readonly supabase: SupabaseService,
  ) {}

  @Get(':token')
  async unsubscribe(@Param('token') token: string, @Res() res: Response): Promise<void> {
    const payload = this.compliance.verifyUnsub(token);
    if (!payload) {
      res.status(400).type('html').send(this.page('This unsubscribe link is invalid or expired.'));
      return;
    }
    try {
      await this.compliance.suppress(payload.u, payload.e, SuppressionReason.Unsubscribe);
      // Stop any of this lead's remaining queued sends immediately.
      await this.supabase
        .getAdminClient()
        .from('messages')
        .update({ state: 'stopped' })
        .eq('lead_id', payload.l)
        .eq('state', 'queued');
      res
        .status(200)
        .type('html')
        .send(this.page("You've been unsubscribed. You won't receive any more emails from this sender."));
    } catch (err) {
      this.logger.error(`Unsubscribe failed: ${(err as Error).message}`);
      res
        .status(500)
        .type('html')
        .send(this.page('Something went wrong, but we will not email you again. You can close this page.'));
    }
  }

  private page(message: string): string {
    return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Unsubscribe</title>
<style>
  body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#FAFAF8;color:#1A1A18;
       display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}
  .card{max-width:28rem;padding:2rem;text-align:center;line-height:1.5}
  .check{color:#15803D;font-size:2rem}
</style></head>
<body><div class="card"><div class="check">✓</div><p>${message}</p></div></body></html>`;
  }
}
