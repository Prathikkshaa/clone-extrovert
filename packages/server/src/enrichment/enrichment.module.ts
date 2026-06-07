// EnrichmentModule — provides/exports EnrichmentService (File 08).
// Composes the providers one lead-enrichment needs: DB, the credit gate, the
// crawler, the LLM, Places (details/reviews), and the cache. Consumed by the
// worker's enrichLead processor.
import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { BillingModule } from '../billing/billing.module';
import { CrawlModule } from '../crawl/crawl.module';
import { LlmModule } from '../llm/llm.module';
import { PlacesModule } from '../places/places.module';
import { CacheModule } from '../cache/cache.module';
import { EnrichmentService } from './enrichment.service';

@Module({
  imports: [SupabaseModule, BillingModule, CrawlModule, LlmModule, PlacesModule, CacheModule],
  providers: [EnrichmentService],
  exports: [EnrichmentService],
})
export class EnrichmentModule {}
