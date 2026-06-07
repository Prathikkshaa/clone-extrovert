// OnboardingModule — wires crawl + LLM + Supabase behind the onboarding routes.
import { Module } from '@nestjs/common';
import { CrawlModule, LlmModule, SupabaseModule } from '@extrovertai/server';
import { AuthModule } from '../auth/auth.module';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';

@Module({
  imports: [AuthModule, SupabaseModule, CrawlModule, LlmModule],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}
