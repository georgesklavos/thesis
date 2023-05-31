import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

type jwtValue = {
  sub: string;
  email: string;
};

@Injectable()
export class OptionalGuard implements CanActivate {
  constructor(private readonly jwtSerice: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    const result = this.jwtSerice.decode(authHeader.split(' ')[1]) as jwtValue;

    if (result) {
      req.user = {
        id: result.sub,
        email: result.email,
      };
    }

    return true;
  }
}
