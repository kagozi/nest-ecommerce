import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column()
  comment: string;

  // @ts-ignore
  @ManyToOne(() => User, user => user.reviews)
  user: User;

  // @ts-ignore
  @ManyToOne(() => Product, product => product.reviews)
  product: Product;
}