// OAuthCallbackController — the provider redirect target.
//
// WHY: this endpoint is hit by the provider's browser redirect, which carries NO
// Authorization header — so it is intentionally NOT behind the JWT guard. Instead
// the signed `state` (verified in MailboxesService) ties the callback back to the
// user who started the flow. It always redirects back to the web app with a
// plain-English outcome, never leaking tokens or raw errors.
import { Controller, Get, Logger, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { MailboxesService } from './mailboxes.service';

@Controller('auth')
export class OAuthCallbackController {
  private readonly logger = new Logger(OAuthCallbackController.name);

  constructor(private readonly mailboxes: MailboxesService) {}

  @Get(':provider/callback')
  async callback(
    @Param('provider') provider: string,
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Res() res: Response,
  ): Promise<void> {
    const base = `${this.mailboxes.webBaseUrl()}/mailboxes`;

    // User declined consent (or provider returned an error).
    if (error) {
      res.redirect(`${base}?mailbox=cancelled`);
      return;
    }
    if (!code || !state) {
      res.redirect(`${base}?mailbox=failed`);
      return;
    }

    try {
      const key = await this.mailboxes.completeConnection(provider, code, state);
      res.redirect(`${base}?mailbox=connected&provider=${key}`);
    } catch (err) {
      this.logger.error(`Mailbox callback failed: ${(err as Error).message}`);
      res.redirect(`${base}?mailbox=failed`);
    }
  }
}
