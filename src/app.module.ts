import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { Product } from './products/product.entity';
import { Category } from './products/category.entity';
import { OrdersModule } from './orders/orders.module';
import { Order, OrderItem } from './orders/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.db',
      entities: [User, Product, Category, Order, OrderItem],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


