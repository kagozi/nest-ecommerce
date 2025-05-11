import { Injectable, BadRequestException } from '@nestjs/common';
import { PaystackService } from './paystack/paystack.service';
import { IPaymentGateway } from './interfaces/payment-gateway.interface';
import { PaymentProvider } from './enums/payments.enum';
@Injectable()
export class PaymentFactory {
  constructor(
    private paystackService: PaystackService,
  ) {}

  getGateway(provider: PaymentProvider): IPaymentGateway {
    switch (provider) {
      case PaymentProvider.PAYSTACK:
        return this.paystackService;
      default:
        throw new BadRequestException('Unsupported payment gateway');
    }
  }
}

