// DTO for updating the caller's profile (mailing address + send mode).
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  physical_address?: string;

  @IsOptional()
  @IsIn(['draft', 'autonomous'])
  mode?: 'draft' | 'autonomous';
}
