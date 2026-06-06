// MailboxOAuthModule — provides the OAuth providers + selector.
// WHY: bundles GmailProvider/OutlookProvider behind MailboxOAuthService so api
// (and later worker) import one module. Relies on a global ConfigModule for env.
import { Module } from '@nestjs/common';
import { GmailProvider } from './gmail.provider';
import { OutlookProvider } from './outlook.provider';
import { MailboxOAuthService } from './mailbox-oauth.service';

@Module({
  providers: [GmailProvider, OutlookProvider, MailboxOAuthService],
  exports: [MailboxOAuthService],
})
export class MailboxOAuthModule {}
