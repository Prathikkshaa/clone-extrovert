// OnboardingController — website-to-profile + company-profile endpoints.
// WHY: powers the onboarding flow. All routes require auth and are scoped to the
// caller. Crawl runs inline (kept responsive with a loading state on the web).
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import type { Tables } from '@extrovertai/shared';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth-user.interface';
import { OnboardingService, type CrawlOutcome } from './onboarding.service';
import { AssistDto, CrawlDto, SampleEmailDto, SaveProfileDto } from './onboarding.dto';

@Controller()
@UseGuards(SupabaseAuthGuard)
export class OnboardingController {
  constructor(private readonly onboarding: OnboardingService) {}

  /** Crawl + extract a site into a prefilled profile draft. */
  @Post('onboarding/crawl')
  async crawl(
    @CurrentUser() user: AuthUser,
    @Body() dto: CrawlDto,
  ): Promise<CrawlOutcome> {
    const result = await this.onboarding.crawlAndExtract(user.id, dto.url);
    if (!result.ok) {
      // 400 with a plain message; the web offers the manual path.
      throw new BadRequestException(result.error ?? 'We couldn’t read that site.');
    }
    return result;
  }

  /** AI writing help for a single profile field (services/about/value_prop). */
  @Post('onboarding/assist')
  assist(@CurrentUser() _user: AuthUser, @Body() dto: AssistDto): Promise<{ text: string }> {
    return this.onboarding.assist(dto.field, dto.text);
  }

  /** Generate a realistic AI sample outreach email from the profile details. */
  @Post('onboarding/sample-email')
  sampleEmail(
    @CurrentUser() user: AuthUser,
    @Body() dto: SampleEmailDto,
  ): Promise<{ subject: string; body: string }> {
    return this.onboarding.sampleEmail(user.id, {
      services: dto.services,
      about: dto.about,
      value_prop: dto.value_prop,
      tone: dto.tone,
      proof_points: dto.proof_points,
    });
  }

  @Get('company-profile')
  getProfile(@CurrentUser() user: AuthUser): Promise<Tables<'company_profiles'> | null> {
    return this.onboarding.getProfile(user.id);
  }

  @Put('company-profile')
  saveProfile(
    @CurrentUser() user: AuthUser,
    @Body() dto: SaveProfileDto,
  ): Promise<Tables<'company_profiles'>> {
    return this.onboarding.saveProfile(user.id, dto);
  }
}
