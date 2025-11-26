import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  IPaymentGateway,
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentStatusResponse,
} from '../../domain/payment/interfaces/payment-gateway.interface';
import { Currency } from '../../domain/payment/entities/payment.entity';
import { Balance } from '../../domain/payment/entities/balance.entity';
import { WhishApiException } from './exceptions/whish-api.exception';
import {
  WhishApiResponse,
  WhishBalanceData,
  WhishCreatePaymentData,
  WhishStatusData,
  WhishCreatePaymentRequest,
  WhishGetStatusRequest,
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
      'https://whish.money',
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
        throw error;
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
        throw WhishApiException.fromAxiosError(error);
      },
    );
  }

  private getAuthHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      channel: this.channel,
      secret: this.secret,
      websiteurl: this.websiteUrl,
    };
  }

  /**
   * Get Balance - GET /itel-service/api/payment/account/balance
   */
  async getBalance(): Promise<Balance> {
    try {
      const response = await this.httpClient.get<
        WhishApiResponse<WhishBalanceData>
      >('/itel-service/api/payment/account/balance', {
        headers: this.getAuthHeaders(),
      });

      const data = response.data;
      if (!data.status) {
        throw new WhishApiException(
          data.dialog || 'Failed to get balance',
          400,
          data.code || undefined,
        );
      }

      return new Balance(
        data.data.balance,
        0,
        'LBP',
        new Date(),
      );
    } catch (error) {
      this.logger.error('Failed to get balance', error);
      throw error;
    }
  }

  /**
   * Create Payment - POST /itel-service/api/payment/whish
   */
  async createPayment(
    request: CreatePaymentRequest,
  ): Promise<CreatePaymentResponse> {
    try {
      const payload: WhishCreatePaymentRequest = {
        amount: request.amount,
        currency: request.currency,
        invoice: request.invoice,
        externalId: request.externalId,
        successCallbackUrl: request.successCallbackUrl,
        failureCallbackUrl: request.failureCallbackUrl,
        successRedirectUrl: request.successRedirectUrl,
        failureRedirectUrl: request.failureRedirectUrl,
      };

      const response = await this.httpClient.post<
        WhishApiResponse<WhishCreatePaymentData>
      >('/itel-service/api/payment/whish', payload, {
        headers: this.getAuthHeaders(),
      });

      const data = response.data;
      if (!data.status) {
        throw new WhishApiException(
          data.dialog || 'Failed to create payment',
          400,
          data.code || undefined,
        );
      }

      return {
        collectUrl: data.data.collectUrl,
        externalId: request.externalId,
      };
    } catch (error) {
      this.logger.error('Failed to create payment', error);
      throw error;
    }
  }

  /**
   * Get Payment Status - POST /itel-service/api/payment/collect/status
   */
  async getPaymentStatus(
    externalId: number,
    currency: Currency,
  ): Promise<PaymentStatusResponse> {
    try {
      const payload: WhishGetStatusRequest = {
        currency: currency,
        externalId: externalId,
      };

      const response = await this.httpClient.post<
        WhishApiResponse<WhishStatusData>
      >('/itel-service/api/payment/collect/status', payload, {
        headers: this.getAuthHeaders(),
      });

      const data = response.data;
      if (!data.status) {
        throw new WhishApiException(
          data.dialog || 'Failed to get payment status',
          400,
          data.code || undefined,
        );
      }

      return {
        collectStatus: data.data.collectStatus as
          | 'success'
          | 'failed'
          | 'pending',
        payerPhoneNumber: data.data.payerPhoneNumber,
        externalId: externalId,
        currency: currency,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get payment status for externalId: ${externalId}`,
        error,
      );
      throw error;
    }
  }
}
