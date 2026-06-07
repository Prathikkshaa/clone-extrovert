// EnrichmentController — enqueue enrichment + poll per-lead progress (File 08).
// WHY: the UI kicks off bulk enrichment (one worker job per lead) and polls the
// status of those leads to render per-lead progress without blocking the screen.
// All routes require auth and are scoped to the caller.
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth-user.interface';
import {
  EnrichmentApiService,
  type EnqueueResult,
  type EnrichedLead,
} from './enrichment.service';
import { EnqueueEnrichmentDto, EnrichmentStatusDto } from './enrichment.dto';

@Controller('enrichment')
@UseGuards(SupabaseAuthGuard)
export class EnrichmentController {
  constructor(private readonly enrichment: EnrichmentApiService) {}

  /** Enqueue enrichment for selected leads. Returns how many were queued/skipped. */
  @Post('enqueue')
  enqueue(
    @CurrentUser() user: AuthUser,
    @Body() dto: EnqueueEnrichmentDto,
  ): Promise<EnqueueResult> {
    return this.enrichment.enqueue(user.id, dto.leadIds);
  }

  /** Poll current enrichment state for the given leads. */
  @Post('status')
  status(
    @CurrentUser() user: AuthUser,
    @Body() dto: EnrichmentStatusDto,
  ): Promise<EnrichedLead[]> {
    return this.enrichment.status(user.id, dto.leadIds);
  }
}
