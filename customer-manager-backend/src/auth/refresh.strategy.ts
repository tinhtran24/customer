import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { validate } from 'class-validator';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: process.env.REFRESH_SECRET,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      // email: payload.email,
      // role: payload.role,
    };
  }
}
