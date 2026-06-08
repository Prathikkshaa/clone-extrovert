// SendingWorkerModule — mounts the send-step BullMQ consumer in the worker.
import { Module } from '@nestjs/common';
import { SendingModule } from '@extrovertai/server';
import { SendingWorker } from './sending.worker';

@Module({
  imports: [SendingModule],
  providers: [SendingWorker],
})
export class SendingWorkerModule {}
