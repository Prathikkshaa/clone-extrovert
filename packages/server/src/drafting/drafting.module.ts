// DraftingModule — provides/exports DraftingService (File 09).
// Composes DB + the credit gate + the LLM. Consumed by the worker's draft
// processor and (for edits/regenerate helpers) the API.
import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { BillingModule } from '../billing/billing.module';
import { LlmModule } from '../llm/llm.module';
import { DraftingService } from './drafting.service';

@Module({
  imports: [SupabaseModule, BillingModule, LlmModule],
  providers: [DraftingService],
  exports: [DraftingService],
})
export class DraftingModule {}
