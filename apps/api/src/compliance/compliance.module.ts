// ComplianceModule (api) — exposes the public unsubscribe endpoint (File 11).
// The compliance logic itself lives in @extrovertai/server (shared by all send paths).
import { Module } from '@nestjs/common';
import { ComplianceModule as ServerComplianceModule, SupabaseModule } from '@extrovertai/server';
import { UnsubscribeController } from './unsubscribe.controller';

@Module({
  imports: [ServerComplianceModule, SupabaseModule],
  controllers: [UnsubscribeController],
})
export class ComplianceApiModule {}
