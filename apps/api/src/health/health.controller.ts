// Health controller.
// WHY: a single, dependency-free liveness check (`GET /health`) used to confirm
// the API boots and to surface the app name from the shared constant.
import { Controller, Get } from '@nestjs/common';
import { APP_NAME } from '@extrovertai/shared';

@Controller('health')
export class HealthController {
  @Get()
  check(): { status: 'ok'; app: string } {
    return { status: 'ok', app: APP_NAME };
  }
}
