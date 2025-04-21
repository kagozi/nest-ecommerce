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

    async getTransactionById(id: number): Promise<Transaction> {
        const transaction = await this.transactionRepository.findOne({ where: { id } });
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        return transaction;
    }

    async getTransactionsByType(type: TransactionType): Promise<Transaction[]> {
        return this.transactionRepository.find({ where: { type }, order: { createdAt: 'DESC' } });
    }

    async getTransactionsByWallet(walletId: number): Promise<Transaction[]> {
        return this.transactionRepository.find({ where: { wallet: { id: walletId } }, order: { createdAt: 'DESC' } });
    }

    async getAllTransactions(): Promise<Transaction[]> {
        return this.transactionRepository.find({ order: { createdAt: 'DESC' } });
    }
}
