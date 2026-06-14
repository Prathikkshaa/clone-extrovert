// BillingApiModule — money-in endpoints + the public Stripe webhook (File 14).
// WHY: buy credits (Stripe-hosted Checkout) + usage/balance reads (guarded) and the
// signature-verified webhook that actually grants credits (public).
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BillingModule, StripeModule, SupabaseModule } from '@extrovertai/server';
import { AuthModule } from '../auth/auth.module';
import { BillingController } from './billing.controller';
import { StripeWebhookController } from './stripe-webhook.controller';

@Module({
  // SupabaseModule so the SupabaseAuthGuard's SupabaseService resolves here (same
  // pattern as the other guarded feature modules).
  imports: [ConfigModule, AuthModule, SupabaseModule, BillingModule, StripeModule],
  controllers: [BillingController, StripeWebhookController],
})
export class BillingApiModule {}
