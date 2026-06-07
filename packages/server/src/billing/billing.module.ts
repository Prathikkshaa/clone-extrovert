// BillingModule — provides/exports BillingService (the credit gate).
// Used by api (balance endpoint) and worker (gated processors), and by Files
// 07/08/09/10 (paid actions) and File 14 (purchases).
import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { BillingService } from './billing.service';

@Module({
  imports: [SupabaseModule],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
