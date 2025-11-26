import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  IPaymentGateway,
  CreatePaymentRequest,
} from '../../domain/payment/interfaces/payment-gateway.interface';
import {
  Payment,
  PaymentStatus,
  Currency,
} from '../../domain/payment/entities/payment.entity';
import { Balance } from '../../domain/payment/entities/balance.entity';
import { WhishApiException } from './exceptions/whish-api.exception';
import {
  WhishBalanceResponse,
  WhishPaymentResponse,
  WhishStatusResponse,
  WhishCreatePaymentRequest,
} from './types/whish.types';

/**
 * Whish Payment Gateway - Infrastructure implementation
 * Implements the IPaymentGateway interface following Dependency Inversion Principle
 */
@Injectable()
export class WhishPaymentGateway implements IPaymentGateway {
  private readonly logger = new Logger(WhishPaymentGateway.name);
  private readonly httpClient: AxiosInstance;
  private readonly channel: string;
  private readonly secret: string;
  private readonly websiteUrl: string;

  constructor(private readonly configService: ConfigService) {
    const baseUrl = this.configService.get<string>(
      'PAYMENT_SERVICE_URL',
      'https://api.whish.money',
    );
    this.channel = this.configService.get<string>('WHISH_CHANNEL', '');
    this.secret = this.configService.get<string>('WHISH_SECRET', '');
    this.websiteUrl = this.configService.get<string>('WHISH_WEBSITE_URL', '');

    this.httpClient = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.httpClient.interceptors.request.use(
      (config) => {
        this.logger.debug(
          `Request: ${config.method?.toUpperCase()} ${config.url}`,
        );
        return config;
      },
      (error) => {
        this.logger.error('Request error', error);
        return Promise.reject(error);
      },
    );

    this.httpClient.interceptors.response.use(
      (response) => {
        this.logger.debug(
          `Response: ${response.status} ${response.config.url}`,
        );
        return response;
      },
      (error) => {
        this.logger.error(
          'Response error',
          error.response?.data || error.message,
        );
        return Promise.reject(WhishApiException.fromAxiosError(error));
      },
    );
  }

  private getAuthHeaders(): Record<string, string> {
    return {
      'X-Channel': this.channel,
      'X-Secret': this.secret,
    };
  }

  async getBalance(): Promise<Balance> {
    try {
      const response = await this.httpClient.get<WhishBalanceResponse>(
        '/api/balance',
        {
          headers: this.getAuthHeaders(),
        },
      );

      const data = response.data;
      return new Balance(
        data.balance,
        data.pending,
        data.currency,
        new Date(data.timestamp),
      );
    } catch (error) {
      this.logger.error('Failed to get balance', error);
      throw error;
    }
  }

  async createPayment(request: CreatePaymentRequest): Promise<Payment> {
    try {
      const payload: WhishCreatePaymentRequest = {
        amount: request.amount,
        currency: request.currency,
        description: request.description,
        merchant_reference: request.merchantReference,
        customer_email: request.customerEmail,
        customer_phone: request.customerPhone,
        redirect_url:
          request.redirectUrl || `https://${this.websiteUrl}/payment/callback`,
        webhook_url: request.webhookUrl,
        expires_in: request.expiresIn,
      };

      const response = await this.httpClient.post<WhishPaymentResponse>(
        '/api/payments',
        payload,
        {
          headers: this.getAuthHeaders(),
        },
      );

      return this.mapToPayment(response.data);
    } catch (error) {
      this.logger.error('Failed to create payment', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string): Promise<Payment> {
    try {
      const response = await this.httpClient.get<WhishStatusResponse>(
        `/api/payments/${paymentId}/status`,
        {
          headers: this.getAuthHeaders(),
        },
      );

      return this.mapToPayment(response.data);
    } catch (error) {
      this.logger.error(`Failed to get payment status for ${paymentId}`, error);
      throw error;
    }
  }

  async cancelPayment(paymentId: string): Promise<boolean> {
    try {
      await this.httpClient.post(
        `/api/payments/${paymentId}/cancel`,
        {},
        {
          headers: this.getAuthHeaders(),
        },
      );
      return true;
    } catch (error) {
      this.logger.error(`Failed to cancel payment ${paymentId}`, error);
      throw error;
    }
  }

  private mapToPayment(
    data: WhishPaymentResponse | WhishStatusResponse,
  ): Payment {
    return new Payment(
      data.id,
      data.amount,
      data.currency as Currency,
      this.mapStatus(data.status),
      data.payment_url,
      data.merchant_reference,
      new Date(data.created_at),
      data.expires_at ? new Date(data.expires_at) : undefined,
    );
  }

  private mapStatus(status: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      pending: PaymentStatus.PENDING,
      completed: PaymentStatus.COMPLETED,
      paid: PaymentStatus.COMPLETED,
      failed: PaymentStatus.FAILED,
      cancelled: PaymentStatus.CANCELLED,
      expired: PaymentStatus.EXPIRED,
    };
    return statusMap[status.toLowerCase()] || PaymentStatus.PENDING;
  }
}
