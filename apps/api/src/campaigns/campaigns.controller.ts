// CampaignsController — launch + monitor outreach campaigns (File 10).
// All routes require auth and are scoped to the caller.
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth-user.interface';
import {
  CampaignsService,
  type CampaignDetail,
  type CampaignSummary,
  type SendPlan,
  type StartResult,
} from './campaigns.service';
import { CampaignStatusDto, StartCampaignDto } from './campaigns.dto';

@Controller('campaigns')
@UseGuards(SupabaseAuthGuard)
export class CampaignsController {
  constructor(private readonly campaigns: CampaignsService) {}

  /** Preview the send plan for a list's approved drafts (no side effects). */
  @Get('plan')
  plan(@CurrentUser() user: AuthUser, @Query('listId') listId: string): Promise<SendPlan> {
    return this.campaigns.plan(user.id, listId);
  }

  /** Start sending: create the campaign + schedule the first sends. */
  @Post('start')
  start(@CurrentUser() user: AuthUser, @Body() dto: StartCampaignDto): Promise<StartResult> {
    return this.campaigns.start(user.id, dto.listId);
  }

  @Get()
  list(@CurrentUser() user: AuthUser): Promise<CampaignSummary[]> {
    return this.campaigns.list(user.id);
  }

  @Get(':id')
  detail(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<CampaignDetail> {
    return this.campaigns.detail(user.id, id);
  }

  @Post(':id/status')
  setStatus(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: CampaignStatusDto,
  ): Promise<{ status: string }> {
    return this.campaigns.setStatus(user.id, id, dto.status);
  }
}
