// ComplianceModule — provides/exports the non-removable compliance guard (File 11).
// Used by the sending engine (File 10) and the reply-send path (File 11) — the one
// place suppression + unsubscribe + physical-address rules live.
import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { ComplianceService } from './compliance.service';

@Module({
  imports: [SupabaseModule],
  providers: [ComplianceService],
  exports: [ComplianceService],
})
export class ComplianceModule {}
