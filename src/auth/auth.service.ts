import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { UserRole } from '../users/dto/create-user.dto';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }


  async loginWithGoogle(idToken: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    //@ts-ignore
    const { email, name } = payload;

    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.usersService.create({
        firstName: name,
        email: email,
        lastName: '',
        password: '',
        role: UserRole.USER,
      });
    }

    const tokenPayload = { email: user.email, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(tokenPayload) };
  }
}