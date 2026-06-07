// LeadsController — lead search + lists (master-context §2/§6).
// WHY: the search endpoint is the first consumer of the credit gate. All routes
// require auth and are scoped to the caller.
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth-user.interface';
import { LeadsService, type SearchOutcome } from './leads.service';
import { SearchDto, SaveToListDto } from './leads.dto';

@Controller()
@UseGuards(SupabaseAuthGuard)
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  /** Run a metered lead search. Returns ok:false with a reason (out_of_credits/
   *  busy/error) rather than throwing, so the UI can prompt appropriately. */
  @Post('leads/search')
  search(@CurrentUser() user: AuthUser, @Body() dto: SearchDto): Promise<SearchOutcome> {
    return this.leads.runSearch(user.id, {
      industry: dto.industry,
      location: dto.location,
      filters: dto.filters,
    });
  }

  @Get('lists')
  getLists(@CurrentUser() user: AuthUser) {
    return this.leads.getLists(user.id);
  }

  @Post('leads/save-to-list')
  saveToList(
    @CurrentUser() user: AuthUser,
    @Body() dto: SaveToListDto,
  ): Promise<{ listId: string; linked: number }> {
    return this.leads.saveToList(user.id, {
      listId: dto.listId,
      listName: dto.listName,
      leadIds: dto.leadIds,
    });
  }
}
