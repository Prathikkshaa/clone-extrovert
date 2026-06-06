// UsersModule.
// WHY: groups the profile endpoint + service. Imports AuthModule (the JWT guard)
// and SupabaseModule (admin DB access for the profile row).
import { Module } from '@nestjs/common';
import { SupabaseModule } from '@extrovertai/server';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AuthModule, SupabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
