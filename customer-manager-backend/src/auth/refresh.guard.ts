import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import {
  REFRESH_TOKEN_EXPIRES,
  THIS_FEATURE_NEED_LOGIN,
} from 'src/utils/messageConstants';

@Injectable()
export class RefreshAuthGuard extends AuthGuard('jwt-refresh') {
  constructor(private authService: AuthService) {
    super();
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new ForbiddenException(THIS_FEATURE_NEED_LOGIN);
    }

    return user;
  }
}
