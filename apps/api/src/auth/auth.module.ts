// AuthModule.
// WHY: provides the SupabaseAuthGuard (which depends on SupabaseService) and
// exports it so any feature module can protect routes with @UseGuards.
import { Module } from '@nestjs/common';
import { SupabaseModule } from '@extrovertai/server';
import { SupabaseAuthGuard } from './supabase-auth.guard';

@Module({
  imports: [SupabaseModule],
  providers: [SupabaseAuthGuard],
  exports: [SupabaseAuthGuard],
})
export class AuthModule {}
