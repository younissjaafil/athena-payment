import { Currency } from '../../../domain/payment/entities/payment.entity';

/**
 * Create Payment Response DTO
 */
export class CreatePaymentResponseDto {
  collectUrl: string;
  externalId: number;
}

/**
 * Payment Status Response DTO
 */
export class PaymentStatusResponseDto {
  collectStatus: 'success' | 'failed' | 'pending';
  payerPhoneNumber: string;
  externalId: number;
  currency: Currency;
}
