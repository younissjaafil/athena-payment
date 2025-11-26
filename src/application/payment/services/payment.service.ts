import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IPaymentGateway } from '../../../domain/payment/interfaces/payment-gateway.interface';
import {
  PAYMENT_GATEWAY,
  CreatePaymentRequest,
} from '../../../domain/payment/interfaces/payment-gateway.interface';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentResponseDto } from '../dto/payment-response.dto';
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
  async createPayment(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    this.logger.log(`Creating payment: ${dto.amount} ${dto.currency}`);

    const request: CreatePaymentRequest = {
      amount: dto.amount,
      currency: dto.currency,
      description: dto.description,
      merchantReference: dto.merchantReference,
      customerEmail: dto.customerEmail,
      customerPhone: dto.customerPhone,
      redirectUrl: dto.redirectUrl,
      webhookUrl: dto.webhookUrl,
      expiresIn: dto.expiresIn,
    };

    const payment = await this.paymentGateway.createPayment(request);

    this.logger.log(`Payment created: ${payment.id}`);
    return PaymentResponseDto.fromEntity(payment);
  }

  /**
   * Get payment status by ID
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentResponseDto> {
    this.logger.log(`Fetching payment status: ${paymentId}`);
    const payment = await this.paymentGateway.getPaymentStatus(paymentId);
    return PaymentResponseDto.fromEntity(payment);
  }

  /**
   * Cancel a pending payment
   */
  async cancelPayment(paymentId: string): Promise<{ success: boolean }> {
    this.logger.log(`Cancelling payment: ${paymentId}`);
    const success = await this.paymentGateway.cancelPayment(paymentId);
    return { success };
  }
}
