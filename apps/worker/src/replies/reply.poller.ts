// ReplyPoller — periodically ingest replies/bounces for every connected mailbox.
//
// WHY: MVP uses polling (push/webhooks are a future upgrade). Every REPLY_POLL_SECONDS
// (default 120s) we read each connected mailbox's threads we started and ingest any
// new inbound messages (replies → stop-on-reply + classify; bounces → suppress).
// A single in-flight guard prevents overlapping runs.
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReplyIngestionService, SupabaseService } from '@extrovertai/server';
import type { Tables } from '@extrovertai/shared';

const DEFAULT_POLL_SECONDS = 120;

@Injectable()
export class ReplyPoller implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ReplyPoller.name);
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;

  constructor(
    private readonly config: ConfigService,
    private readonly supabase: SupabaseService,
    private readonly ingestion: ReplyIngestionService,
  ) {}

  onModuleInit(): void {
    const seconds = Number(this.config.get<string>('REPLY_POLL_SECONDS') ?? DEFAULT_POLL_SECONDS);
    const intervalMs = Math.max(30, seconds) * 1000;
    this.timer = setInterval(() => void this.tick(), intervalMs);
    this.logger.log(`Reply poller running (every ${intervalMs / 1000}s).`);
  }

  private async tick(): Promise<void> {
    if (this.running) return;
    this.running = true;
    try {
      const { data } = await this.supabase
        .getAdminClient()
        .from('mailboxes')
        .select('*')
        .eq('status', 'connected');
      for (const mailbox of (data as Tables<'mailboxes'>[]) ?? []) {
        await this.ingestion.pollMailbox(mailbox);
      }
    } catch (err) {
      this.logger.warn(`Reply poll tick failed: ${(err as Error).message}`);
    } finally {
      this.running = false;
    }
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
