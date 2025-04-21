import { forwardRef, Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet } from './wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
   imports: [
      TypeOrmModule.forFeature([Wallet]),
      forwardRef(() => UsersModule),
      TransactionModule
    ],
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
