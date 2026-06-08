// InboxModule (api) — threaded inbox + AI reply endpoints (File 11).
import { Module } from '@nestjs/common';
import {
  ComplianceModule,
  DraftingModule,
  MailboxOAuthModule,
  SupabaseModule,
} from '@extrovertai/server';
import { AuthModule } from '../auth/auth.module';
import { InboxController } from './inbox.controller';
import { InboxService } from './inbox.service';

@Module({
  imports: [AuthModule, SupabaseModule, DraftingModule, ComplianceModule, MailboxOAuthModule],
  controllers: [InboxController],
  providers: [InboxService],
})
export class InboxModule {}
