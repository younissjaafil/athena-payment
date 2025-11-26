import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { Currency } from '../../../domain/payment/entities/payment.entity';

/**
 * Create Payment DTO - Request validation
 */
export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  amount: number;

  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;

  @IsString()
  @IsNotEmpty()
  invoice: string; // Description about the payment

  @IsNumber()
  @IsNotEmpty()
  externalId: number; // Unique ID from your system

  @IsUrl()
  @IsNotEmpty()
  successCallbackUrl: string;

  @IsUrl()
  @IsNotEmpty()
  failureCallbackUrl: string;

  @IsUrl()
  @IsNotEmpty()
  successRedirectUrl: string;

  @IsUrl()
  @IsNotEmpty()
  failureRedirectUrl: string;
}
