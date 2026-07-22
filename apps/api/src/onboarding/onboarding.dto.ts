// DTOs for onboarding/company-profile endpoints (validated by the global pipe).
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CrawlDto {
  @IsString()
  @MaxLength(2000)
  url!: string;
}

export class AssistDto {
  @IsIn(['services', 'about', 'value_prop'])
  field!: 'services' | 'about' | 'value_prop';

  @IsString()
  @MaxLength(2000)
  text!: string;
}

export class SaveProfileDto {
  @IsOptional()
  @IsString()
  website?: string | null;

  @IsOptional()
  @IsString()
  services?: string | null;

  @IsOptional()
  @IsString()
  about?: string | null;

  @IsOptional()
  @IsString()
  value_prop?: string | null;

  @IsOptional()
  @IsString()
  tone?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  proof_points?: string[];

  @IsOptional()
  @IsString()
  logo_url?: string | null;

  @IsOptional()
  @IsString()
  brand_color?: string | null;

  @IsOptional()
  @IsIn(['fetched', 'official'])
  theme_source?: 'fetched' | 'official';
}
