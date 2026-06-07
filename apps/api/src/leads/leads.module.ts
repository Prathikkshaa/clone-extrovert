// LeadsModule — wires Places + billing gate + cache + DB behind the search routes.
import { Module } from '@nestjs/common';
import {
  BillingModule,
  CacheModule,
  PlacesModule,
  SupabaseModule,
} from '@extrovertai/server';
import { AuthModule } from '../auth/auth.module';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  imports: [AuthModule, SupabaseModule, BillingModule, PlacesModule, CacheModule],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
