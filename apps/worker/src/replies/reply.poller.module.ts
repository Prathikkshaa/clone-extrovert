// ReplyPollerModule — mounts the reply-ingestion poller in the worker.
import { Module } from '@nestjs/common';
import { RepliesModule, SupabaseModule } from '@extrovertai/server';
import { ReplyPoller } from './reply.poller';

@Module({
  imports: [SupabaseModule, RepliesModule],
  providers: [ReplyPoller],
})
export class ReplyPollerModule {}
