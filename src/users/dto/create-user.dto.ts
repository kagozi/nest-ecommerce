import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin', 
  USER = 'user',
  VENDOR = 'vendor',
}
export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
  
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole.USER;
}