import { Balance } from '../entities/balance.entity';
import { Currency, Payment } from '../entities/payment.entity';

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
  createPayment(request: CreatePaymentRequest): Promise<Payment>;

  /**
   * Get payment status by ID
   */
  getPaymentStatus(paymentId: string): Promise<Payment>;

  /**
   * Cancel a pending payment
   */
  cancelPayment(paymentId: string): Promise<boolean>;
}

export interface CreatePaymentRequest {
  amount: number;
  currency: Currency;
  description?: string;
  merchantReference?: string;
  customerEmail?: string;
  customerPhone?: string;
  redirectUrl?: string;
  webhookUrl?: string;
  expiresIn?: number; // in minutes
}

export const PAYMENT_GATEWAY = Symbol('IPaymentGateway');
