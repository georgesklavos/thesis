import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UsersService } from './users/users.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const speakeasy = require('speakeasy');

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Body() body, @Request() req) {
    //Function to login user
    const user = await this.userService.findUser(body.email);

    //Check 2fa code
    const result = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token: body.password2FA,
    });

    if (!result) {
      throw new UnauthorizedException();
    }

    return this.authService.login(req.user);
  }
}
