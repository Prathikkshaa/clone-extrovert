// BookingApiModule — mounts the public Cal.com webhook endpoint (File 13).
// WHY: capture verified booking webhooks into booking_events + advance the lead.
// The booking LINK itself is a user-profile field set via /me (UsersModule); this
// module owns only the inbound Cal.com integration.
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookingModule } from '@extrovertai/server';
import { CalcomWebhookController } from './calcom-webhook.controller';

@Module({
  imports: [ConfigModule, BookingModule],
  controllers: [CalcomWebhookController],
})
export class BookingApiModule {}
