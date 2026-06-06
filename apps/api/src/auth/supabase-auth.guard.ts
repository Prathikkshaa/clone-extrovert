// SupabaseAuthGuard — validates the Supabase JWT on protected routes.
//
// WHY: a single, reusable guard so every protected endpoint authenticates the
// same way. It reads the `Authorization: Bearer <token>` header and verifies the
// token by asking Supabase Auth (`auth.getUser(token)`) — this works regardless
// of the project's JWT signing scheme (HS256 or asymmetric) and needs no extra
// secret. On success it attaches an AuthUser to `request.user`.
//
// USAGE: `@UseGuards(SupabaseAuthGuard)` on a controller/handler, then read the
// caller via the `@CurrentUser()` param decorator.
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { SupabaseService } from '@extrovertai/server';
import type { AuthUser } from './auth-user.interface';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(SupabaseAuthGuard.name);

  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractBearerToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('Missing or malformed Authorization header.');
    }

    const { data, error } = await this.supabase.getAdminClient().auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired session.');
    }

    const user: AuthUser = { id: data.user.id, email: data.user.email ?? null };
    (request as Request & { user: AuthUser }).user = user;
    return true;
  }

  private extractBearerToken(header: string | undefined): string | null {
    if (!header) {
      return null;
    }
    const [scheme, value] = header.split(' ');
    return scheme === 'Bearer' && value ? value : null;
  }
}
