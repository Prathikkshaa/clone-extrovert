// DTOs for enrichment endpoints (validated by the global pipe).
import { ArrayNotEmpty, IsArray, IsString, ArrayMaxSize } from 'class-validator';

export class EnqueueEnrichmentDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(200)
  @IsString({ each: true })
  leadIds!: string[];
}

export class EnrichmentStatusDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(200)
  @IsString({ each: true })
  leadIds!: string[];
}
