import { forwardRef, Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

@Module({
   imports: [
      TypeOrmModule.forFeature([Review]), forwardRef(() => UsersModule), forwardRef(() => ProductsModule), // Adjust the import path as necessary
    ],
  providers: [ReviewsService],
  controllers: [ReviewsController]
})
export class ReviewsModule {}
