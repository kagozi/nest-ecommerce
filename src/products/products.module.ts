import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { Category } from './category.entity'; 
import { UsersModule } from '../users/users.module'; // Import UsersModule

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([Product, Category])], 
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService], 
})
export class ProductsModule {}