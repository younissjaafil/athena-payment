import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WhishPaymentGateway } from './whish-payment.gateway';
import { PAYMENT_GATEWAY } from '../../domain/payment/interfaces/payment-gateway.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PAYMENT_GATEWAY,
      useClass: WhishPaymentGateway,
    },
    WhishPaymentGateway,
  ],
  exports: [PAYMENT_GATEWAY, WhishPaymentGateway],
})
export class WhishModule {}
