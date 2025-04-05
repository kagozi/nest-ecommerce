import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders/order.entity';

@Module({
   imports: [
      TypeOrmModule.forFeature([Order]), 
    ],
  providers: [InvoicesService],
  controllers: [InvoicesController]
})
export class InvoicesModule {}
