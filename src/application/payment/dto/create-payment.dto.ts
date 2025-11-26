import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsString,
  IsEmail,
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
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  merchantReference?: string;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsUrl()
  @IsOptional()
  redirectUrl?: string;

  @IsUrl()
  @IsOptional()
  webhookUrl?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  expiresIn?: number;
}
