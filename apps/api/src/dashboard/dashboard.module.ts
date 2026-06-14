// DashboardModule — metrics aggregation + deliverability health (File 12).
import { Module } from '@nestjs/common';
import { BillingModule, SendingModule, SupabaseModule } from '@extrovertai/server';
import { AuthModule } from '../auth/auth.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [SupabaseModule, BillingModule, SendingModule, AuthModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
