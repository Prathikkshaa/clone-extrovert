// StripeModule — provides StripeService (Stripe Checkout + verified webhook grants).
// WHY: a single injectable provider for all Stripe API access (master-context §10),
// importable by apps/api (the checkout endpoint + the webhook controller).
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from '../supabase/supabase.module';
import { BillingModule } from '../billing/billing.module';
import { StripeService } from './stripe.service';

@Module({
  imports: [ConfigModule, SupabaseModule, BillingModule],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
