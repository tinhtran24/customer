import {
  ExecutionContext, forwardRef, HttpException, HttpStatus, Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/auth/auth.decorators';
import { THIS_FEATURE_NEED_LOGIN } from 'src/utils/messageConstants';
import { AuthHelper } from "./jwt.helper";
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
      @Inject(forwardRef(() => AuthHelper))
      private reflector: Reflector,
      private readonly authHelper: AuthHelper
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    } else {
      const request = context.switchToHttp().getRequest();
      const token = this.extractToken(request);
      try {
        const payload = await  this.authHelper.decodeJwtToken(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp < currentTime) {
          throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
        }
        request['user'] = payload;
      } catch {
        throw new HttpException('Invalid signin token', HttpStatus.UNAUTHORIZED);
      }
    }
    return true;
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException(THIS_FEATURE_NEED_LOGIN);
    }
    return user;
  }
}
