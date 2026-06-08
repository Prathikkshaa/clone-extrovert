// CampaignsModule (api) — launch + monitor endpoints. The actual sending runs in
// the worker (via @extrovertai/server's SendingModule); this module produces the
// initial send jobs and reads campaign state.
import { Module } from '@nestjs/common';
import { ComplianceModule, SendingModule, SupabaseModule } from '@extrovertai/server';
import { AuthModule } from '../auth/auth.module';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';

@Module({
  imports: [AuthModule, SupabaseModule, SendingModule, ComplianceModule],
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}
