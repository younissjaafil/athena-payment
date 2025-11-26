import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IPaymentGateway } from '../../../domain/payment/interfaces/payment-gateway.interface';
import { PAYMENT_GATEWAY } from '../../../domain/payment/interfaces/payment-gateway.interface';
import { Currency } from '../../../domain/payment/entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import {
  CreatePaymentResponseDto,
  PaymentStatusResponseDto,
} from '../dto/payment-response.dto';
import { BalanceResponseDto } from '../dto/balance-response.dto';

/**
 * Payment Service - Application layer service
 * Orchestrates payment operations following Single Responsibility Principle
 */
@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  /**
   * Get current account balance
   */
  async getBalance(): Promise<BalanceResponseDto> {
    this.logger.log('Fetching account balance');
    const balance = await this.paymentGateway.getBalance();
    return BalanceResponseDto.fromEntity({
      available: balance.available,
      pending: balance.pending,
      total: balance.total,
      currency: balance.currency,
      lastUpdated: balance.lastUpdated,
    });
  }

  /**
   * Create a new payment
   */
  async createPayment(
    dto: CreatePaymentDto,
  ): Promise<CreatePaymentResponseDto> {
    this.logger.log(`Creating payment: ${dto.amount} ${dto.currency}`);

    const result = await this.paymentGateway.createPayment({
      amount: dto.amount,
      currency: dto.currency,
      invoice: dto.invoice,
      externalId: dto.externalId,
      successCallbackUrl: dto.successCallbackUrl,
      failureCallbackUrl: dto.failureCallbackUrl,
      successRedirectUrl: dto.successRedirectUrl,
      failureRedirectUrl: dto.failureRedirectUrl,
    });

    this.logger.log(`Payment created with URL: ${result.collectUrl}`);
    return result;
  }

  /**
   * Get payment status by external ID
   */
  async getPaymentStatus(
    externalId: number,
    currency: Currency,
  ): Promise<PaymentStatusResponseDto> {
    this.logger.log(`Fetching payment status for externalId: ${externalId}`);
    return this.paymentGateway.getPaymentStatus(externalId, currency);
  }
}
