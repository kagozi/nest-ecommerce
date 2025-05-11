import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentFactory } from './payment.factory';
import { PaystackService } from './paystack/paystack.service';
import { PaystackWebhookController } from './paystack/paystack.webhook.controller';
import { OrdersModule } from '../orders/orders.module';
import { WalletModule } from '../wallet/wallet.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    HttpModule,
    OrdersModule,
    WalletModule,
    CartModule
  ],
  controllers: [
    PaymentsController,
    PaystackWebhookController,
  ],
  providers: [
    PaymentsService,
    PaymentFactory,
    PaystackService,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
