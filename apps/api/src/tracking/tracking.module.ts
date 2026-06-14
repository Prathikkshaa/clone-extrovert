// TrackingApiModule — wires the public click-redirect endpoint (File 12).
import { Module } from '@nestjs/common';
import { TrackingModule } from '@extrovertai/server';
import { ClickRedirectController } from './click-redirect.controller';

@Module({
  imports: [TrackingModule],
  controllers: [ClickRedirectController],
})
export class TrackingApiModule {}
