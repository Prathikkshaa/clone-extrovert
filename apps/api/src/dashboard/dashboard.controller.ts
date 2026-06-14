// DashboardController — trustworthy metrics + drill-downs (File 12, guarded).
// WHY: the dashboard answers "is my outreach working?" with reliable, money-linked
// numbers. The summary is cheap (counts only); drill-downs are on-demand below the fold.
import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth-user.interface';
import {
  DashboardService,
  type CampaignStat,
  type DashboardSummary,
  type LeadStat,
} from './dashboard.service';

@Controller('dashboard')
@UseGuards(SupabaseAuthGuard)
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('summary')
  async summary(
    @CurrentUser() user: AuthUser,
    @Query('days') days?: string,
  ): Promise<DashboardSummary> {
    return this.dashboard.summary(user.id, this.parseDays(days));
  }

  @Get('campaigns')
  async campaigns(
    @CurrentUser() user: AuthUser,
    @Query('days') days?: string,
  ): Promise<CampaignStat[]> {
    return this.dashboard.campaigns(user.id, this.parseDays(days));
  }

  @Get('campaigns/:id/leads')
  async campaignLeads(
    @CurrentUser() user: AuthUser,
    @Param('id', new ParseUUIDPipe()) campaignId: string,
  ): Promise<LeadStat[]> {
    return this.dashboard.campaignLeads(user.id, campaignId);
  }

  private parseDays(days?: string): number {
    const n = Number(days);
    return Number.isFinite(n) && n > 0 ? n : 30;
  }
}
