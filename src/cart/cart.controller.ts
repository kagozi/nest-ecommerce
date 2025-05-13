import { Controller, Post, Get, Patch, Delete, Param, Body, Req, UseGuards, forwardRef, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { OrdersService } from '../orders/orders.service';
import { PaymentsService } from '../payments/payments.service';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly orderService: OrdersService,
    private readonly paymentsService: PaymentsService,
  ) { }

  @Post('add')
  addItem(@Req() req, @Body() createCartItemDto: CreateCartItemDto) {
    const userId = req.user.id;
    return this.cartService.addItem(userId, createCartItemDto);
  }

  @Patch('update/:itemId')
  updateItem(@Req() req, @Param('itemId') itemId: number, @Body() updateCartItemDto: UpdateCartItemDto) {
    console.log({ itemId: itemId })
    const userId = req.user.id;
    return this.cartService.updateItem(userId, itemId, updateCartItemDto);
  }

  @Delete('remove/:itemId')
  removeItem(@Req() req, @Param('itemId') itemId: number) {
    const userId = req.user.id;
    return this.cartService.removeItem(userId, itemId);
  }

  @Get('summary')
  getCartSummary(@Req() req) {
    const userId = req.user.id;
    return this.cartService.getCartSummary(userId);
  }

  @Post('checkout')
  async checkout(@Req() req) {
    const userId = req.user.id;
    const cart = await this.cartService.getCartSummary(userId);
    // Integrate the order placement and payment here
    const orderItems = cart.items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price, // assuming product has a price field
    }));

    const orderDto: CreateOrderDto = {
      userId,
      items: orderItems,
    };

    const order = await this.orderService.createOrder(orderDto);

    const payment = await this.paymentsService.initiatePayment(
      req.gateway || 'paystack',
      order.id,
      order.total,
      req.user.email,
    );
    if (!payment) {
      throw new BadRequestException('Payment initiation failed');
    }
    return { message: 'Payment Initialized' };
  }
}