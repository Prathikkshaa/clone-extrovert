// SendingModule — provides/exports the sequence engine + capacity services (File 10).
// Consumed by the worker's send processor and the API (campaign plan + monitor).
import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { BillingModule } from '../billing/billing.module';
import { CacheModule } from '../cache/cache.module';
import { MailboxOAuthModule } from '../mailbox/mailbox.module';
import { MailboxCapacityService } from './mailbox-capacity.service';
import { SendingService } from './sending.service';

@Module({
  imports: [SupabaseModule, BillingModule, CacheModule, MailboxOAuthModule],
  providers: [MailboxCapacityService, SendingService],
  exports: [MailboxCapacityService, SendingService],
})
export class SendingModule {}
