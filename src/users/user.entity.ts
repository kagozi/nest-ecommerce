import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRole } from './dto/create-user.dto';
import { Product } from '../products/product.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column({ default: '' })
  firstName: string;

  @Column({ default: '' })
  lastName: string;

  @Column()
  password: string;

  @Column({ default: UserRole.USER })
  role: string; 

  @Column({ default: '' })
  profile: string;

  @OneToMany(() => Product, product => product.user)
  products: Product[];
}