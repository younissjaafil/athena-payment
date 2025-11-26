import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { WebhookController } from './controllers/webhook.controller';
import { PaymentService } from '../../application/payment/services/payment.service';
import { WhishModule } from '../../infrastructure/whish/whish.module';

@Module({
  imports: [WhishModule],
  controllers: [PaymentController, WebhookController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentApiModule {}
