import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { PaymentService } from '../../../application/payment/services/payment.service';
import { CreatePaymentDto } from '../../../application/payment/dto/create-payment.dto';
import { PaymentResponseDto } from '../../../application/payment/dto/payment-response.dto';
import { BalanceResponseDto } from '../../../application/payment/dto/balance-response.dto';
import { PaymentExceptionFilter } from '../filters/payment-exception.filter';

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
  ): Promise<PaymentResponseDto> {
    return this.paymentService.createPayment(createPaymentDto);
  }

  /**
   * Get payment status
   * GET /payments/:id/status
   */
  @Get(':id/status')
  async getPaymentStatus(
    @Param('id') paymentId: string,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.getPaymentStatus(paymentId);
  }

  /**
   * Cancel a payment
   * POST /payments/:id/cancel
   */
  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelPayment(
    @Param('id') paymentId: string,
  ): Promise<{ success: boolean }> {
    return this.paymentService.cancelPayment(paymentId);
  }
}
