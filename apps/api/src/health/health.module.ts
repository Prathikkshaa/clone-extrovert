// Health module.
// WHY: groups liveness + DB-readiness endpoints. Imports SupabaseModule so the
// controller can perform a trivial read to confirm DB connectivity.
import { Module } from '@nestjs/common';
import { SupabaseModule } from '@extrovertai/server';
import { HealthController } from './health.controller';

@Module({
  imports: [SupabaseModule],
  controllers: [HealthController],
})
export class HealthModule {}
