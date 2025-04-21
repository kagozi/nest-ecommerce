import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    // forwardRef(() => UsersModule),
    // forwardRef(() => WalletModule),
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule { }
