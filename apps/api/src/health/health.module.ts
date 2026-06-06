// Health module.
// WHY: groups the liveness endpoint so deploy targets and the worker can probe
// that the API is up.
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
