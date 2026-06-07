// CreditsModule — exposes the balance endpoint.
import { Module } from '@nestjs/common';
import { BillingModule, SupabaseModule } from '@extrovertai/server';
import { AuthModule } from '../auth/auth.module';
import { CreditsController } from './credits.controller';

@Module({
  // SupabaseModule is imported so the SupabaseAuthGuard's SupabaseService resolves
  // in this module's injector (same pattern as the other feature modules).
  imports: [AuthModule, SupabaseModule, BillingModule],
  controllers: [CreditsController],
})
export class CreditsModule {}
