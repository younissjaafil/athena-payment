import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Get Payment Status DTO
 */
export class GetPaymentStatusDto {
  @IsString()
  @IsNotEmpty()
  paymentId: string;
}
