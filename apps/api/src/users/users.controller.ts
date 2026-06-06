// UsersController — the authenticated profile endpoint.
// WHY: `GET /me` is the first protected route. It proves the auth guard works
// end-to-end and ensures the caller's `users` row exists (created on first call).
// PATTERN for future protected endpoints: guard with SupabaseAuthGuard and read
// the caller via @CurrentUser().
import { Controller, Get, UseGuards } from '@nestjs/common';
import type { Tables } from '@extrovertai/shared';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth-user.interface';
import { UsersService } from './users.service';

@Controller('me')
@UseGuards(SupabaseAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  getMe(@CurrentUser() user: AuthUser): Promise<Tables<'users'>> {
    return this.users.getOrCreateProfile(user.id, user.email);
  }
}
