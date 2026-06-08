// DraftingModule (api) — bulk-draft producer + review/edit/approve/regenerate.
// The heavy LLM work lives in the worker (via @extrovertai/server's
// DraftingService, imported here for the regenerate delete + queue contract).
import { Module } from '@nestjs/common';
import { BillingModule, DraftingModule as ServerDraftingModule, SupabaseModule } from '@extrovertai/server';
import { AuthModule } from '../auth/auth.module';
import { DraftingController } from './drafting.controller';
import { DraftingApiService } from './drafting.service';

@Module({
  imports: [AuthModule, SupabaseModule, BillingModule, ServerDraftingModule],
  controllers: [DraftingController],
  providers: [DraftingApiService],
})
export class DraftingModule {}
