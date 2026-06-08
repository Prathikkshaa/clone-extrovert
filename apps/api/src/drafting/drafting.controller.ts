// DraftingController — bulk draft + review queue + edit/approve/regenerate (File 09).
// WHY: the UI kicks off bulk drafting (one worker job per lead), loads the review
// queue (drafts grouped per lead with the hook), saves inline edits, approves a
// lead's drafts (ready for File 10), and regenerates. All routes require auth and
// are scoped to the caller.
import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth-user.interface';
import {
  DraftingApiService,
  type DraftMessage,
  type EnqueueResult,
  type LeadDrafts,
} from './drafting.service';
import { EditDraftDto, LeadIdDto, LeadIdsDto } from './drafting.dto';

@Controller('drafts')
@UseGuards(SupabaseAuthGuard)
export class DraftingController {
  constructor(private readonly drafting: DraftingApiService) {}

  /** Enqueue drafting for selected leads. Returns how many were queued/skipped. */
  @Post('enqueue')
  enqueue(@CurrentUser() user: AuthUser, @Body() dto: LeadIdsDto): Promise<EnqueueResult> {
    return this.drafting.enqueue(user.id, dto.leadIds);
  }

  /** Review queue: drafts grouped per lead (with the hook) — also the progress poll. */
  @Post('by-leads')
  byLeads(@CurrentUser() user: AuthUser, @Body() dto: LeadIdsDto): Promise<LeadDrafts[]> {
    return this.drafting.byLeads(user.id, dto.leadIds);
  }

  /** Save an inline edit to one draft message. */
  @Put(':id')
  edit(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: EditDraftDto,
  ): Promise<DraftMessage> {
    return this.drafting.edit(user.id, id, { subject: dto.subject, body: dto.body });
  }

  /** Approve all of a lead's drafts (ready for sending in File 10). */
  @Post('approve')
  approve(@CurrentUser() user: AuthUser, @Body() dto: LeadIdDto): Promise<{ approved: number }> {
    return this.drafting.approve(user.id, dto.leadId);
  }

  /** Regenerate a lead's drafts (deletes existing, re-drafts; metered again). */
  @Post('regenerate')
  regenerate(
    @CurrentUser() user: AuthUser,
    @Body() dto: LeadIdDto,
  ): Promise<{ ok: boolean; balance: number; reason?: string }> {
    return this.drafting.regenerate(user.id, dto.leadId);
  }
}
