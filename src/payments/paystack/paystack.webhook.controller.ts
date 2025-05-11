import {
    Controller,
    Post,
    Req,
    Headers,
    BadRequestException,
    Body,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from '../../orders/orders.service';
import { WalletService } from '../../wallet/wallet.service';
import { Request } from 'express';
import * as crypto from 'crypto';
import { OrderStatus } from '../../orders/order.entity';
import { CartService } from '../../cart/cart.service';
import { UserRole } from '../../users/dto/create-user.dto';

@Controller('webhooks/paystack')
export class PaystackWebhookController {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly walletService: WalletService,
        private readonly cartService: CartService,
        private readonly configService: ConfigService
    ) { }

    @Post()
    async handleWebhook(
        @Req() req: Request,
        @Headers('x-paystack-signature') signature: string,
        @Body() body: any,
    ) {
        const secret = this.configService.get<string>('PAYSTACK_SECRET_KEY');
        if (!secret) {
            throw new BadRequestException('Paystack secret key not configured');
        }
        const hash = crypto
            .createHmac('sha512', secret)
            .update(JSON.stringify(body))
            .digest('hex');

        if (hash !== signature) {
            throw new BadRequestException('Invalid Paystack signature');
        }

        const event = body.event;
        if (event !== 'charge.success') return { received: true };

        const metadata = body.data?.metadata;
        const orderId = metadata?.orderId;
        if (!orderId) throw new BadRequestException('Missing order ID in metadata');

        const order = await this.ordersService.findOrderById(orderId);
        if (!order || order.status === OrderStatus.PAID) return { received: true };

        await this.ordersService.updateOrderStatus(orderId, { status: OrderStatus.PAID });

        // Credit vendors
        for (const item of order.items) {
            const vendor = item.product.user;
            const amount = item.price;
            // Credit the user wallet on successful payment if vendor is not and admin
            if (vendor.role !== UserRole.ADMIN) {
                await this.walletService.creditWallet(
                    vendor.id,
                    amount,
                    `ORDER-${order.id}`,
                );
            };
        }
        // Clear cart items
        await this.cartService.clearCart(order.user.id);
        return { received: true };
    }
}
