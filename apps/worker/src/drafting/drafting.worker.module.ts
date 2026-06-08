// DraftingWorkerModule — mounts the draftLead BullMQ consumer in the worker.
import { Module } from '@nestjs/common';
import { DraftingModule } from '@extrovertai/server';
import { DraftingWorker } from './drafting.worker';

@Module({
  imports: [DraftingModule],
  providers: [DraftingWorker],
})
export class DraftingWorkerModule {}
