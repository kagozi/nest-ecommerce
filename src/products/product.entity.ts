import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

export enum Currency {
  USD = 'USD',
  KES = 'KES',
}

export class Amount {
  amount: number;
  currency: Currency;
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column(() => Amount)
  price: Amount;

  @Column()
  sku: string;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  coverPhoto: string;

  @Column('text', { array: true, nullable: true })
  images: string[];

  @ManyToOne(() => Category, category => category.products)
  category: Category;

}