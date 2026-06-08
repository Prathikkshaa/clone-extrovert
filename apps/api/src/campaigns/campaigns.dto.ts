// DTOs for the campaign endpoints (validated by the global pipe).
import { IsIn, IsString, IsUUID } from 'class-validator';

export class StartCampaignDto {
  @IsString()
  @IsUUID()
  listId!: string;
}

export class CampaignStatusDto {
  @IsIn(['paused', 'active'])
  status!: 'paused' | 'active';
}
