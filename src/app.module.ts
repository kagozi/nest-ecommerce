import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { InvoicesModule } from './invoices/invoices.module';
import { CartModule } from './cart/cart.module';
import { ReviewsModule } from './reviews/reviews.module';
import { Cart, CartItem } from './cart/cart.entity';
import { Review } from './reviews/review.entity';
import { WishlistModule } from './wishlist/wishlist.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Wishlist } from './wishlist/wishlist.entity';
import { Notification } from './notifications/notifications.entity';
import { WalletModule } from './wallet/wallet.module';
import { Wallet } from './wallet/wallet.entity';
import { TransactionModule } from './transaction/transaction.module';
import { Transaction } from './transaction/transaction.entity';
import { FileUploadModule } from './file-upload/file-upload.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.db',
      entities: [User, Product, Category, Order, OrderItem, Cart, CartItem, Review, Wishlist, Notification, Wallet, Transaction],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    InvoicesModule,
    CartModule,
    ReviewsModule,
    WishlistModule,
    NotificationsModule,
    WalletModule,
    TransactionModule,
    FileUploadModule,
    PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


