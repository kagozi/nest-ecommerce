import { forwardRef, Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, CartItem } from './cart.entity'; // Adjust the import path as necessary
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem]),  forwardRef(() => UsersModule), forwardRef(() => ProductsModule),],
  providers: [CartService,],
  controllers: [CartController]
})
export class CartModule {}
