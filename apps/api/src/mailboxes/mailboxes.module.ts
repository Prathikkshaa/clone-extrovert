// MailboxesModule.
// WHY: groups mailbox connect/list/disconnect + the OAuth callback. Imports the
// auth guard, Supabase (DB), crypto (token encryption), and the OAuth providers.
import { Module } from '@nestjs/common';
import { CryptoModule, MailboxOAuthModule, SupabaseModule } from '@extrovertai/server';
import { AuthModule } from '../auth/auth.module';
import { MailboxesController } from './mailboxes.controller';
import { OAuthCallbackController } from './oauth-callback.controller';
import { MailboxesService } from './mailboxes.service';

@Module({
  imports: [AuthModule, SupabaseModule, CryptoModule, MailboxOAuthModule],
  controllers: [MailboxesController, OAuthCallbackController],
  providers: [MailboxesService],
})
export class MailboxesModule {}
