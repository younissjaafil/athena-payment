import { Balance } from '../entities/balance.entity';
import { Currency } from '../entities/payment.entity';

/**
 * Payment Gateway Interface - Defines the contract for payment providers
 * Following Interface Segregation Principle (SOLID)
 */
export interface IPaymentGateway {
  /**
   * Get current account balance
   */
  getBalance(): Promise<Balance>;

  /**
   * Create a new payment link
   */
  createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse>;

  /**
   * Get payment status by external ID
   */
  getPaymentStatus(
    externalId: number,
    currency: Currency,
  ): Promise<PaymentStatusResponse>;
}

export interface CreatePaymentRequest {
  amount: number;
  currency: Currency;
  invoice: string; // Description about the payment
  externalId: number; // Unique ID from your system
  successCallbackUrl: string;
  failureCallbackUrl: string;
  successRedirectUrl: string;
  failureRedirectUrl: string;
}

export interface CreatePaymentResponse {
  collectUrl: string;
  externalId: number;
}

export interface PaymentStatusResponse {
  collectStatus: 'success' | 'failed' | 'pending';
  payerPhoneNumber: string;
  externalId: number;
  currency: Currency;
}

export const PAYMENT_GATEWAY = Symbol('IPaymentGateway');
