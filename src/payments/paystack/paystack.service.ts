import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IPaymentGateway } from '../interfaces/payment-gateway.interface';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PaystackService implements IPaymentGateway {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }

    async createCheckoutSession(data: {
        orderId: number;
        amount: number;
        items: any[];
        customerEmail: string;
    }): Promise<{ url: string; sessionId: string }> {
        const paystackAmount = data.amount * 100; // Paystack requires amount in kobo

        const payload = {
            email: data.customerEmail,
            amount: paystackAmount,
            metadata: {
                orderId: data.orderId,
            },
            callback_url: `${this.configService.get<string>('FRONTEND_URL')}/checkout-success`, // or /webhook
        };

        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.configService.get<string>('BASE_URL')}/transaction/initialize`, payload, {
                    headers: {
                        Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
                        'Content-Type': 'application/json',
                    },
                }),
            );

            const responseData = (response as { data: { data: { authorization_url: string; reference: string } } }).data?.data;
            return {
                url: responseData.authorization_url,
                sessionId: responseData.reference,
            };
        } catch (err) {
            console.error('Paystack error:', err?.response?.data || err.message);
            throw new BadRequestException('Paystack payment initialization failed');
        }
    }
}
