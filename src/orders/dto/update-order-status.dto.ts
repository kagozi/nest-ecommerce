import { IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '../order.entity';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  status: OrderStatus;
}