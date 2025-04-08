import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Export UsersService if needed in other modules
})
export class UsersModule {}
