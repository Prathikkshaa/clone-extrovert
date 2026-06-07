// EnrichmentModule (api) — enqueue + status endpoints.
// The heavy enrichment work lives in the worker (via @extrovertai/server's
// EnrichmentService); this module only produces jobs and reports progress.
import { Module } from '@nestjs/common';
import { BillingModule, SupabaseModule } from '@extrovertai/server';
import { AuthModule } from '../auth/auth.module';
import { EnrichmentController } from './enrichment.controller';
import { EnrichmentApiService } from './enrichment.service';

@Module({
  imports: [AuthModule, SupabaseModule, BillingModule],
  controllers: [EnrichmentController],
  providers: [EnrichmentApiService],
})
export class EnrichmentModule {}
