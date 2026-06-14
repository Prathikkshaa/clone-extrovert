// ClickRedirectController — the public link-click redirect endpoint (File 12).
//
// WHY: outbound emails have their links rewritten to `GET /r/:token`. When a
// recipient clicks, we record a `click_events` row (a trustworthy engagement signal,
// unlike opens) and 302 them on to the real destination. Recording is best-effort —
// a tracking failure must NEVER strand the recipient. Intentionally NOT auth-guarded
// (the recipient is not a logged-in user); the HMAC-signed token carries the IDs and
// the real URL, and verifyClick rejects tampered tokens + non-http(s) destinations.
import { Controller, Get, Logger, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ClickTrackingService } from '@extrovertai/server';

@Controller('r')
export class ClickRedirectController {
  private readonly logger = new Logger(ClickRedirectController.name);

  constructor(private readonly clickTracking: ClickTrackingService) {}

  @Get(':token')
  async redirect(@Param('token') token: string, @Res() res: Response): Promise<void> {
    const payload = this.clickTracking.verifyClick(token);
    if (!payload) {
      // Invalid/forged token — don't redirect anywhere; show a plain notice.
      res.status(400).type('html').send(this.page('This link is invalid or has expired.'));
      return;
    }
    await this.clickTracking.recordClick(payload); // best-effort (never throws)
    res.redirect(302, payload.url);
  }

  private page(message: string): string {
    return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Link</title>
<style>body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#FAFAF8;color:#1A1A18;
display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}
.card{max-width:28rem;padding:2rem;text-align:center;line-height:1.5}</style></head>
<body><div class="card"><p>${message}</p></div></body></html>`;
  }
}
