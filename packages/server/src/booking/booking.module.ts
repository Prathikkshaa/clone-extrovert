// BookingModule — provides BookingService (Cal.com link + verified webhook capture).
// WHY: a single injectable provider for all Cal.com access (master-context §10),
// importable by apps/api (the webhook controller + send path).
import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { BookingService } from './booking.service';

@Module({
  imports: [SupabaseModule],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
