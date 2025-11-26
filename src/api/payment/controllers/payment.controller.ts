import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { PaymentService } from '../../../application/payment/services/payment.service';
import { CreatePaymentDto } from '../../../application/payment/dto/create-payment.dto';
import {
  CreatePaymentResponseDto,
  PaymentStatusResponseDto,
} from '../../../application/payment/dto/payment-response.dto';
import { BalanceResponseDto } from '../../../application/payment/dto/balance-response.dto';
import { PaymentExceptionFilter } from '../filters/payment-exception.filter';
import { Currency } from '../../../domain/payment/entities/payment.entity';

/**
 * Payment Controller - API layer
 * Handles HTTP requests for payment operations
 */
@Controller('payments')
@UseFilters(PaymentExceptionFilter)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Get account balance
   * GET /payments/balance
   */
  @Get('balance')
  async getBalance(): Promise<BalanceResponseDto> {
    return this.paymentService.getBalance();
  }

  /**
   * Create a new payment
   * POST /payments
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<CreatePaymentResponseDto> {
    return this.paymentService.createPayment(createPaymentDto);
  }

  /**
   * Get payment status
   * POST /payments/status
   */
  @Post('status')
  @HttpCode(HttpStatus.OK)
  async getPaymentStatus(
    @Body() body: { externalId: number; currency: Currency },
  ): Promise<PaymentStatusResponseDto> {
    return this.paymentService.getPaymentStatus(body.externalId, body.currency);
  }
}
