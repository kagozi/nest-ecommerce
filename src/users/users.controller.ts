
import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return await this.authService.login(user.email, createUserDto.password);
    } catch (error) {
      throw new BadRequestException('Invalid Payload');
    }

  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    return req.user;
  }

  // @UseGuards(JwtAuthGuard)
  // @Patch('profile')
  // async updateProfile(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
  //   const user = req.user;
  //   // Ignore ts error
  //   // @ts-ignore
  //   await this.usersService.update(user.id, updateUserDto);
  //   // @ts-ignore
  //   return this.usersService.findOneByEmail(user.email);
  // }
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Req() req: any, // You can create a custom type for the user object if needed
    @Body() updateUserDto: UpdateUserDto
  ) {
    const userId = req.user?.id;
    const email = req.user?.email;

    await this.usersService.update(userId, updateUserDto);
    return this.usersService.findOneByEmail(email);
  }


  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteProfile(@Req() req: Request) {
    const user = req.user;
    // @ts-ignore
    await this.usersService.remove(user.id);
  }
}