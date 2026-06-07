// DTOs for lead search + lists (validated by the global pipe).
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FiltersDto {
  @IsOptional()
  @IsBoolean()
  noWebsite?: boolean;

  @IsOptional()
  @IsNumber()
  maxRating?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxReviews?: number;
}

export class SearchDto {
  @IsString()
  @MaxLength(120)
  industry!: string;

  @IsString()
  @MaxLength(120)
  location!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FiltersDto)
  filters?: FiltersDto;
}

export class SaveToListDto {
  @IsOptional()
  @IsString()
  listId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  listName?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  leadIds!: string[];
}
