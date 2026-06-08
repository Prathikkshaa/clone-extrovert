// InboxController — threaded inbox + AI reply draft/send (File 11). Auth-scoped.
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import type { ReplyDraftResult } from '@extrovertai/server';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth-user.interface';
import {
  InboxService,
  type Conversation,
  type SendReplyResult,
  type ThreadView,
} from './inbox.service';
import { SendReplyDto } from './inbox.dto';

@Controller('inbox')
@UseGuards(SupabaseAuthGuard)
export class InboxController {
  constructor(private readonly inbox: InboxService) {}

  @Get()
  conversations(@CurrentUser() user: AuthUser): Promise<Conversation[]> {
    return this.inbox.conversations(user.id);
  }

  @Get(':leadId')
  thread(@CurrentUser() user: AuthUser, @Param('leadId') leadId: string): Promise<ThreadView> {
    return this.inbox.thread(user.id, leadId);
  }

  @Post(':leadId/draft-reply')
  draftReply(
    @CurrentUser() user: AuthUser,
    @Param('leadId') leadId: string,
  ): Promise<ReplyDraftResult> {
    return this.inbox.draftReply(user.id, leadId);
  }

  @Post(':leadId/send-reply')
  sendReply(
    @CurrentUser() user: AuthUser,
    @Param('leadId') leadId: string,
    @Body() dto: SendReplyDto,
  ): Promise<SendReplyResult> {
    return this.inbox.sendReply(user.id, leadId, dto.body);
  }
}
