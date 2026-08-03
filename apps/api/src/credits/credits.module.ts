// CreditsModule — exposes the balance endpoint.
import { Module } from '@nestjs/common';
import { BillingModule, SupabaseModule } from '@extrovertai/server';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CreditsController } from './credits.controller';

@Module({
  // SupabaseModule is imported so the SupabaseAuthGuard's SupabaseService resolves
  // in this module's injector (same pattern as the other feature modules).
  // UsersModule gives us UsersService so the balance call can lazily create the
  // profile + grant signup credits (so a brand-new account shows its free credits
  // immediately, not 0).
  imports: [AuthModule, SupabaseModule, BillingModule, UsersModule],
  controllers: [CreditsController],
})
export class CreditsModule {}
