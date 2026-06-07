// LlmModule — provides/exports LlmService (reused by File 05 onboarding and
// File 09 drafting).
import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';

@Module({
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}
