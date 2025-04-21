import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';
import { User } from '../users/user.entity';
import { Currency } from '../products/product.entity';

@Entity()
export class Wallet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    balance: number;

    @Column({ type: 'text', nullable: true })
    currency: Currency;

    @OneToOne(() => User, user => user.wallet, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @OneToMany(() => Transaction, transaction => transaction.wallet)
    transactions: Transaction[];
}
