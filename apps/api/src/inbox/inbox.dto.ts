// DTO for sending a reply from the inbox.
import { IsString, MaxLength, MinLength } from 'class-validator';

export class SendReplyDto {
  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  body!: string;
}
