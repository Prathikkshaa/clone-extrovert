// DTO for updating the caller's profile (mailing address + send mode + booking link).
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  physical_address?: string;

  @IsOptional()
  @IsIn(['draft', 'autonomous'])
  mode?: 'draft' | 'autonomous';

  // The user's Cal.com booking link (BYO for v1). Permissive here; the service
  // normalizes it (adds https://, validates http(s)) and stores null when cleared.
  @IsOptional()
  @IsString()
  @MaxLength(500)
  booking_url?: string;
}
