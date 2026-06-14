// DTO for starting a Stripe Checkout for a chosen credit pack.
import { IsString, MaxLength } from 'class-validator';

export class CheckoutDto {
  // The pack id (validated against the catalogue server-side in StripeService).
  @IsString()
  @MaxLength(40)
  packId!: string;
}
