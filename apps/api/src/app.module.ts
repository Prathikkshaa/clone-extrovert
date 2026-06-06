// Root API module.
// WHY: the composition root for the HTTP API. It wires global configuration
// (env loaded from the repo-root .env) and mounts feature modules. Feature
// modules (auth, leads, billing, …) are added by later build files.
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Run from apps/api, so the repo-root .env is two levels up.
      envFilePath: ['../../.env'],
    }),
    HealthModule,
    UsersModule,
  ],
})
export class AppModule {}
