// MailboxesController — authenticated mailbox management.
// WHY: lets a logged-in user start an OAuth connect, list connected mailboxes
// (metadata only — never tokens), and disconnect one. All routes require auth.
import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import type { OAuthProviderKey } from '@extrovertai/server';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth-user.interface';
import { MailboxesService } from './mailboxes.service';

@Controller('mailboxes')
@UseGuards(SupabaseAuthGuard)
export class MailboxesController {
  constructor(private readonly mailboxes: MailboxesService) {}

  /** Which providers are configured (for enabling/disabling the UI buttons). */
  @Get('providers')
  providers(): Record<OAuthProviderKey, boolean> {
    return this.mailboxes.providerStatus();
  }

  /** Start the OAuth flow: returns the provider consent URL for the browser. */
  @Get('connect/:provider')
  connect(
    @CurrentUser() user: AuthUser,
    @Param('provider') provider: string,
  ): { url: string } {
    return { url: this.mailboxes.getConnectUrl(user.id, provider) };
  }

  /** List the current user's connected mailboxes (no tokens). */
  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.mailboxes.listMailboxes(user.id);
  }

  /** Disconnect a mailbox. */
  @Delete(':id')
  async disconnect(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<{ ok: true }> {
    await this.mailboxes.disconnect(user.id, id);
    return { ok: true };
  }
}
