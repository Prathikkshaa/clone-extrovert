// MailboxOAuthModule — provides the OAuth providers + selector.
// WHY: bundles GmailProvider/OutlookProvider behind MailboxOAuthService so api
// (and later worker) import one module. Relies on a global ConfigModule for env.
import { Module } from '@nestjs/common';
import { CryptoModule } from '../crypto/crypto.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { GmailProvider } from './gmail.provider';
import { OutlookProvider } from './outlook.provider';
import { MailboxOAuthService } from './mailbox-oauth.service';
import { MailboxSenderService } from './mailbox-sender.service';

@Module({
  imports: [CryptoModule, SupabaseModule],
  providers: [GmailProvider, OutlookProvider, MailboxOAuthService, MailboxSenderService],
  exports: [MailboxOAuthService, MailboxSenderService],
})
export class MailboxOAuthModule {}
