// CreditsController — credit balance + recent ledger (master-context §6).
// WHY: lets the UI show the balance, warn at low balance, and answer "where did
// my credits go" with a short recent-ledger summary. Full top-up UI is File 14.
import { Controller, Get, UseGuards } from '@nestjs/common';
import { BillingService, type LedgerEntry } from '@extrovertai/server';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth-user.interface';
import { UsersService } from '../users/users.service';

@Controller('credits')
@UseGuards(SupabaseAuthGuard)
export class CreditsController {
  constructor(
    private readonly billing: BillingService,
    private readonly users: UsersService,
  ) {}

  @Get('balance')
  async balance(
    @CurrentUser() user: AuthUser,
  ): Promise<{ balance: number; recent: LedgerEntry[] }> {
    // Ensure the account's profile exists first — this is what grants the one-time
    // signup credits, so a brand-new user sees their free credits right away
    // (the balance chip loads on every navigation, so this always runs early).
    await this.users.getOrCreateProfile(user.id, user.email);
    const [balance, recent] = await Promise.all([
      this.billing.getBalance(user.id),
      this.billing.recentLedger(user.id, 10),
    ]);
    return { balance, recent };
  }
}
