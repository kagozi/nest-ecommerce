import { Injectable } from '@nestjs/common';
import { Wallet } from './wallet.entity';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../products/product.entity';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
    ) { }

    async createWalletForUser(user: User): Promise<Wallet> {
        const wallet = this.walletRepository.create({ user, balance: 0, currency: Currency.KES });
        return this.walletRepository.save(wallet);
    }
}
