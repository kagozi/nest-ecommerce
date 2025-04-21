import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Currency } from '../product.entity';
export class CreateProductDto {

  @IsOptional()
  @IsNumber()
  userId: number;


  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  currency: Currency;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsString()
  coverPhoto?: string;

  @IsOptional()
  @IsString()
  images?: string[];
}