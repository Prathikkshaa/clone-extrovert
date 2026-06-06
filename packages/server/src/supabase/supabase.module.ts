// SupabaseModule.
// WHY: provides and exports SupabaseService so api/worker feature modules can
// inject it. Relies on a global ConfigModule (configured in each app) for env.
import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
