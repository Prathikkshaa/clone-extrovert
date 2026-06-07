// CrawlModule — provides/exports CrawlService (reused by File 05 onboarding and
// File 08 lead enrichment).
import { Module } from '@nestjs/common';
import { CrawlService } from './crawl.service';

@Module({
  providers: [CrawlService],
  exports: [CrawlService],
})
export class CrawlModule {}
