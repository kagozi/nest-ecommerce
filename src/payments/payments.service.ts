import { Injectable } from '@nestjs/common';
import { PaymentFactory } from './payment.factory';
import { PaymentProvider } from './enums/payments.enum';
@Injectable()
export class PaymentsService {
  constructor(private paymentFactory: PaymentFactory) {}

  async initiatePayment(
    provider: PaymentProvider,
    orderId: number,
    amount: number,
    customerEmail: string,
  ) {
    const gateway = this.paymentFactory.getGateway(provider);
    return gateway.createCheckoutSession({ orderId, amount, customerEmail });
  }
}

