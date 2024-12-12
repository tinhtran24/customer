import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import User from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { RefreshStrategy } from 'src/auth/refresh.strategy';
import { AuthHelper } from "./jwt.helper";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthHelper,
    AuthService,
    JwtStrategy,
    UsersService,
    ConfigService,
    RefreshStrategy,
  ],
  exports: [AuthHelper, JwtStrategy, PassportModule],
})
export class AuthModule {}
