import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly walletService: WalletService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, role } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ email, password: hashedPassword, role });
    const savedUser = await this.usersRepository.save(user);
    // Create wallet after user is saved
    await this.walletService.createWalletForUser(savedUser);
    return this.findOneById(savedUser.id)
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const updateData: Partial<User> = { ...updateUserDto };

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Remove undefined or null values from updateData
    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] == null) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    if (Object.keys(updateData).length === 0) {
      throw new Error('No valid fields provided for update');
    }

    await this.usersRepository.update(id, updateData);
  }


  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {    
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.update(user.id, { password: hashedPassword });
  }
}