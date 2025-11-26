import {
  Currency,
  PaymentStatus,
} from '../../../domain/payment/entities/payment.entity';

/**
 * Payment Response DTO
 */
export class PaymentResponseDto {
  id: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  paymentUrl: string;
  merchantReference: string;
  createdAt: Date;
  expiresAt?: Date;

  static fromEntity(payment: {
    id: string;
    amount: number;
    currency: Currency;
    status: PaymentStatus;
    paymentUrl: string;
    merchantReference: string;
    createdAt: Date;
    expiresAt?: Date;
  }): PaymentResponseDto {
    const dto = new PaymentResponseDto();
    dto.id = payment.id;
    dto.amount = payment.amount;
    dto.currency = payment.currency;
    dto.status = payment.status;
    dto.paymentUrl = payment.paymentUrl;
    dto.merchantReference = payment.merchantReference;
    dto.createdAt = payment.createdAt;
    dto.expiresAt = payment.expiresAt;
    return dto;
  }
}
