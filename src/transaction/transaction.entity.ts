import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text' })
  type: TransactionType;
  

  @Column()
  reference: string;

  @ManyToOne(() => Wallet, wallet => wallet.transactions, { eager: true })
  wallet: Wallet;

  @CreateDateColumn()
  createdAt: Date;
}
