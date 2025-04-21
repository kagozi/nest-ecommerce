import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Wallet } from './wallet.entity';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../products/product.entity';
import { UsersService } from '../users/users.service';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionType } from '../transaction/transaction.entity';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,

        private transactionService: TransactionService,
    ) { }

    async createWalletForUser(user: User): Promise<Wallet> {
        const wallet = this.walletRepository.create({ user, balance: 0, currency: Currency.KES });
        return this.walletRepository.save(wallet);
    }

    async getUserWallet(userId: number): Promise<Wallet> {
        const user = await this.usersService.findOneById(userId);
        if (!user || !user.wallet) throw new NotFoundException('User wallet not found');
        return user.wallet;
    }

    async creditWallet(userId: number, amount: number, reference: string) {
        const wallet = await this.getUserWallet(userId);
        wallet.balance += amount;
        await this.walletRepository.save(wallet);

        await this.transactionService.logTransaction(wallet, amount, TransactionType.CREDIT, reference);
        return wallet;
    }

    async debitWallet(userId: number, amount: number, reference: string) {
        const wallet = await this.getUserWallet(userId);
        if (wallet.balance < amount) throw new Error('Insufficient balance');

        wallet.balance -= amount;
        await this.walletRepository.save(wallet);

        await this.transactionService.logTransaction(wallet, amount, TransactionType.DEBIT, reference);
        return wallet;
    }

    // Get wallet balance
    async getWalletBalance(userId: number): Promise<number> {
        const wallet = await this.getUserWallet(userId);
        return wallet.balance;
    }
    // Get wallet transactions
    async getWalletTransactions(userId: number) {
        const wallet = await this.getUserWallet(userId);
        return this.transactionService.getWalletTransactions(wallet.id);
    }
}
