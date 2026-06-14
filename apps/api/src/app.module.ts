// Root API module.
// WHY: the composition root for the HTTP API. It wires global configuration
// (env loaded from the repo-root .env) and mounts feature modules. Feature
// modules (auth, leads, billing, …) are added by later build files.
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { MailboxesModule } from './mailboxes/mailboxes.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { CreditsModule } from './credits/credits.module';
import { LeadsModule } from './leads/leads.module';
import { EnrichmentModule } from './enrichment/enrichment.module';
import { DraftingModule } from './drafting/drafting.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { InboxModule } from './inbox/inbox.module';
import { ComplianceApiModule } from './compliance/compliance.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TrackingApiModule } from './tracking/tracking.module';
import { BookingApiModule } from './booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Run from apps/api, so the repo-root .env is two levels up.
      envFilePath: ['../../.env'],
    }),
    HealthModule,
    UsersModule,
    MailboxesModule,
    OnboardingModule,
    CreditsModule,
    LeadsModule,
    EnrichmentModule,
    DraftingModule,
    CampaignsModule,
    InboxModule,
    ComplianceApiModule,
    DashboardModule,
    TrackingApiModule,
    BookingApiModule,
  ],
})
export class AppModule {}
