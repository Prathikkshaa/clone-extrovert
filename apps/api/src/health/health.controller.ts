// Health controller.
// WHY: `GET /health` is a dependency-free liveness check; `GET /health/db`
// confirms the backend Supabase admin client can reach Postgres (a trivial
// count on an empty table). Surfaces a calm 503 if the DB is unreachable.
import {
  Controller,
  Get,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { APP_NAME } from '@extrovertai/shared';
import { SupabaseService } from '@extrovertai/server';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly supabase: SupabaseService) {}

  @Get()
  check(): { status: 'ok'; app: string } {
    return { status: 'ok', app: APP_NAME };
  }

  @Get('db')
  async checkDb(): Promise<{ status: 'ok'; table: string; count: number }> {
    const { count, error } = await this.supabase
      .getAdminClient()
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      this.logger.error(`DB readiness check failed: ${error.message}`);
      throw new ServiceUnavailableException('Database is not reachable.');
    }

    return { status: 'ok', table: 'users', count: count ?? 0 };
  }
}
