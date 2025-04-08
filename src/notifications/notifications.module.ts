import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notifications.entity'; 
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), forwardRef(() => UsersModule)],
  providers: [NotificationsService],
  controllers: [NotificationsController]
})
export class NotificationsModule {}
