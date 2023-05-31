import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  private readonly Logger = new Logger(AuthService.name);

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findUser(email);

      const match = await bcrypt.compare(password, user.password);

      if (user && match) {
        const { password, firstName, lastName, ...rest } = user;
        return rest;
      }
    } catch (err) {
      return null;
    }
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
    };
    this.Logger.log(`User with id "${payload.sub}" has been authorized`);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
