import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';

/**
 * Webhook Controller - Handles payment callbacks from Whish
 */
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  /**
   * Handle payment webhook from Whish
   * POST /webhooks/payment
   */
  @Post('payment')
  @HttpCode(HttpStatus.OK)
  handlePaymentWebhook(
    @Headers('x-whish-signature') signature: string,
    @Body() payload: PaymentWebhookPayload,
  ): { received: boolean } {
    this.logger.log(`Received webhook for payment: ${payload.paymentId}`);
    this.logger.debug(`Webhook signature: ${signature}`);

    // TODO: Verify webhook signature
    // TODO: Process webhook event (update payment status, emit events, etc.)

    // Log the event
    this.logger.log(
      `Payment ${payload.paymentId} status changed to: ${payload.status}`,
    );

    return { received: true };
  }
}

interface PaymentWebhookPayload {
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
  timestamp: string;
  merchantReference?: string;
}
