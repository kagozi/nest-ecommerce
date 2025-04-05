import { forwardRef, Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { Wishlist } from './wishlist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

@Module({
   imports: [
        TypeOrmModule.forFeature([Wishlist]), forwardRef(() => UsersModule), forwardRef(() => ProductsModule), // Adjust the import path as necessary
      ],
  providers: [WishlistService],
  controllers: [WishlistController]
})
export class WishlistModule {}
