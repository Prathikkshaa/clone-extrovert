// EnrichmentModule (api) — enqueue + status endpoints.
// The heavy enrichment work lives in the worker (via @extrovertai/server's
// EnrichmentService); this module only produces jobs and reports progress.
import { Module } from '@nestjs/common';
import {
  BillingModule,
  SupabaseModule,
  EnrichmentModule as EnrichmentCoreModule,
} from '@extrovertai/server';
import { AuthModule } from '../auth/auth.module';
import { EnrichmentController } from './enrichment.controller';
import { EnrichmentApiService } from './enrichment.service';

@Module({
  // EnrichmentCoreModule provides the heavy EnrichmentService so the API can
  // process leads inline as a fallback when no separate worker is consuming the
  // queue (e.g. local dev running only web + api).
  imports: [AuthModule, SupabaseModule, BillingModule, EnrichmentCoreModule],
  controllers: [EnrichmentController],
  providers: [EnrichmentApiService],
})
export class EnrichmentModule {}
