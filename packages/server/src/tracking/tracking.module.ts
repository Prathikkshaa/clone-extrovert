// TrackingModule — provides ClickTrackingService (File 12).
// WHY: link-click tracking is used by the send path (wrap links) and the api's
// public redirect endpoint (verify + record). One injectable, swappable, testable.
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from '../supabase/supabase.module';
import { ClickTrackingService } from './click-tracking.service';

@Module({
  imports: [ConfigModule, SupabaseModule],
  providers: [ClickTrackingService],
  exports: [ClickTrackingService],
})
export class TrackingModule {}
