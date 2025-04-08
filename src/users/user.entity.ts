import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './dto/create-user.dto';
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
}