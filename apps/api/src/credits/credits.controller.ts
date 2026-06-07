// CreditsController — credit balance + recent ledger (master-context §6).
// WHY: lets the UI show the balance, warn at low balance, and answer "where did
// my credits go" with a short recent-ledger summary. Full top-up UI is File 14.
import { Controller, Get, UseGuards } from '@nestjs/common';
import { BillingService, type LedgerEntry } from '@extrovertai/server';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth-user.interface';

@Controller('credits')
@UseGuards(SupabaseAuthGuard)
export class CreditsController {
  constructor(private readonly billing: BillingService) {}

  @Get('balance')
  async balance(
    @CurrentUser() user: AuthUser,
  ): Promise<{ balance: number; recent: LedgerEntry[] }> {
    const [balance, recent] = await Promise.all([
      this.billing.getBalance(user.id),
      this.billing.recentLedger(user.id, 10),
    ]);
    return { balance, recent };
  }
}
