import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IPaymentGateway } from '../interfaces/payment-gateway.interface';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { InitializeTransactionDto } from '../dto/initialize-transaction.dto';
import { OrderStatus } from '../../orders/order.entity';
import {
    PaystackCallbackDto,
    PaystackCreateTransactionDto,
    PaystackCreateTransactionResponseDto,
    PaystackMetadata,
    PaystackVerifyTransactionResponseDto,
    PaystackWebhookDto,
} from '../dto/paystack.dto';

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
        if (!data.amount || !data.customerEmail || !data.orderId) {
            throw new BadRequestException('Missing required checkout data');
        }

        const paystackAmount = data.amount * 100;

        const payload = {
            email: data.customerEmail,
            amount: paystackAmount,
            metadata: {
                orderId: data.orderId,
            },
            callback_url: this.configService.get<string>('PAYSTACK_CALLBACK_URL'),
        };

        const baseUrl = this.configService.get<string>('PAYSTACK_BASE_URL');
        const secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');

        if (!baseUrl || !secretKey) {
            throw new Error('Paystack configuration is missing');
        }

        try {
            const response = await firstValueFrom(
                this.httpService.post(`${baseUrl}/transaction/initialize`, payload, {
                    headers: {
                        Authorization: `Bearer ${secretKey}`,
                        'Content-Type': 'application/json',
                    },
                }),
            );

            const { authorization_url, reference } = response.data?.data || {};
            if (!authorization_url || !reference) {
                throw new BadRequestException('Invalid Paystack response');
            }

            return {
                url: authorization_url,
                sessionId: reference,
            };
        } catch (err) {
            console.error('Paystack error:', err?.response?.data || err.message);
            throw new BadRequestException('Paystack payment initialization failed');
        }
    }

}
