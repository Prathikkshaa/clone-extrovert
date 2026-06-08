// RepliesModule — provides/exports ReplyIngestionService (File 11).
// Used by the worker's reply poller and (for manual re-poll) the API.
import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { LlmModule } from '../llm/llm.module';
import { ComplianceModule } from '../compliance/compliance.module';
import { MailboxOAuthModule } from '../mailbox/mailbox.module';
import { ReplyIngestionService } from './reply-ingestion.service';

@Module({
  imports: [SupabaseModule, LlmModule, ComplianceModule, MailboxOAuthModule],
  providers: [ReplyIngestionService],
  exports: [ReplyIngestionService],
})
export class RepliesModule {}
