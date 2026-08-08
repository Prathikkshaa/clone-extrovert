// BillingController — the authenticated money-in + usage endpoints (File 14).
//
// WHY: lets the UI show the balance, a SEGREGATED usage breakdown (where credits
// went), recent ledger entries, and the buyable packs — and start a Stripe-hosted
// Checkout. Card data never touches us: checkout returns a Stripe URL the browser
// redirects to. Credits are granted by the webhook, not here.
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BillingService,
  StripeService,
  type LedgerEntry,
  type UsageSummary,
} from '@extrovertai/server';
import {
  CREDIT_COSTS,
  CREDIT_PACKS,
  LOW_BALANCE_THRESHOLD,
  type CreditPack,
} from '@extrovertai/shared';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth-user.interface';
import { CheckoutDto } from './billing.dto';

interface BillingSummary {
  balance: number;
  lowBalanceThreshold: number;
  usage: UsageSummary;
  recent: LedgerEntry[];
  packs: readonly CreditPack[];
  creditCosts: typeof CREDIT_COSTS;
  billingConfigured: boolean;
}

@Controller('billing')
@UseGuards(SupabaseAuthGuard)
export class BillingController {
  constructor(
    private readonly billing: BillingService,
    private readonly stripe: StripeService,
    private readonly config: ConfigService,
  ) {}

  /** Everything the billing screen needs in one call. */
  @Get('summary')
  async summary(@CurrentUser() user: AuthUser): Promise<BillingSummary> {
    const [balance, usage, recent] = await Promise.all([
      this.billing.getBalance(user.id),
      this.billing.usageSummary(user.id, 30),
      this.billing.recentLedger(user.id, 15),
    ]);
    return {
      balance,
      lowBalanceThreshold: LOW_BALANCE_THRESHOLD,
      usage,
      recent,
      packs: CREDIT_PACKS,
      creditCosts: CREDIT_COSTS,
      billingConfigured: this.stripe.isConfigured(),
    };
  }

  /** The buyable packs + whether Stripe is wired up (gates the buy buttons). */
  @Get('packs')
  packs(): { packs: readonly CreditPack[]; configured: boolean } {
    return { packs: CREDIT_PACKS, configured: this.stripe.isConfigured() };
  }

  /** Detailed activity report over the chosen window — the client renders + prints
   *  it as a PDF. `days` is clamped server-side (1–365) by the underlying methods. */
  @Get('report')
  async report(
    @CurrentUser() user: AuthUser,
    @Query('days') days?: string,
  ): Promise<{
    generatedAt: string;
    days: number;
    balance: number;
    usage: UsageSummary;
    entries: LedgerEntry[];
  }> {
    const n = Number(days) || 30;
    const [balance, usage, entries] = await Promise.all([
      this.billing.getBalance(user.id),
      this.billing.usageSummary(user.id, n),
      this.billing.ledgerSince(user.id, n),
    ]);
    return { generatedAt: new Date().toISOString(), days: usage.windowDays, balance, usage, entries };
  }

  /**
   * Start a Stripe-hosted Checkout for a pack → returns the URL to redirect to. A 200
   * with `{ url }` on success; `{ configured: false }` (still 200) when Stripe isn't
   * set up yet so the UI can show a calm "billing not available" state.
   */
  @Post('checkout')
  async checkout(
    @CurrentUser() user: AuthUser,
    @Body() dto: CheckoutDto,
  ): Promise<{ url: string } | { error: string; configured: boolean }> {
    const result = await this.stripe.createCheckout(user.id, dto.packId, this.webBaseUrl());
    if (result.ok) return { url: result.url };
    return { error: result.message, configured: result.reason !== 'not_configured' };
  }

  /** Where Stripe sends the user back after checkout (the web app origin). */
  private webBaseUrl(): string {
    const explicit = this.config.get<string>('PUBLIC_WEB_URL');
    if (explicit) return explicit.replace(/\/$/, '');
    const port = this.config.get<string>('WEB_PORT') ?? '4200';
    return `http://localhost:${port}`;
  }
}
