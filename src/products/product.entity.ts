import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { User } from '../users/user.entity';
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

  @Column('text')
  currency: Currency;


  @Column()
  price: number;

  @Column({nullable: true})
  sellingPrice: number;

  @Column()
  sku: string;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  coverPhoto: string;

  // @Column('text', { array: true, nullable: true }) // This is for PostgreSQL
  // images: string[];
  @Column('json', { nullable: true })
  images: string[];


  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'categoryId' }) // specify the foreign key column name
  category: Category;
  @Column()
  categoryId: number;  // This will store the foreign key reference

  // Add relationship to User
  @ManyToOne(() => User, user => user.products)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number; // Foreign key to the user who created the product

  @Column({ default: false })
  isApproved: boolean; 

}