import { Injectable } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionType } from './transaction.entity';
import { Wallet } from '../wallet/wallet.entity';
@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
    ) {}

    async logTransaction(wallet: Wallet, amount: number, type: TransactionType, reference: string) {
        const txn = this.transactionRepository.create({ wallet, amount, type, reference });
        return this.transactionRepository.save(txn);
    }

    async getWalletTransactions(walletId: number) {
        return this.transactionRepository.find({ where: { wallet: { id: walletId } }, order: { createdAt: 'DESC' } });
    }
}
