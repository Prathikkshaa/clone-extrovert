// DTOs for drafting endpoints (validated by the global pipe).
import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class LeadIdsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(200)
  @IsString({ each: true })
  leadIds!: string[];
}

export class LeadIdDto {
  @IsString()
  leadId!: string;
}

export class EditDraftDto {
  @IsOptional()
  @IsString()
  @MaxLength(300)
  subject?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8000)
  body?: string;
}
