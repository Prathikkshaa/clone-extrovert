// @CurrentUser() — param decorator exposing the authenticated AuthUser.
// WHY: keeps protected handlers clean (`@CurrentUser() user: AuthUser`) and is
// only meaningful behind SupabaseAuthGuard, which populates `request.user`.
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthUser } from './auth-user.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest<Request & { user: AuthUser }>();
    return request.user;
  },
);
