// Queue module — BullMQ queues/processors (the metering-test queue lives here;
// real queues are added in later files). Imports BillingModule so processors can
// run the credit gate.
import { Module } from '@nestjs/common';
import { BillingModule } from '@extrovertai/server';
import { QueueService } from './queue.service';

@Module({
  imports: [BillingModule],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
