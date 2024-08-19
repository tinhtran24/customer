import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { NEW_USER_CREATED } from 'src/utils/messageConstants';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<{ result: string }> {
    const newUser = await this.usersService.createUser(createUserDto);

    if (!newUser) {
      return null;
    }

    return { result: NEW_USER_CREATED };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const result = await this.validateUser(loginDto.email, loginDto.password);

    if (result) {
      const payload = {
        sub: result?.id,
        email: result?.email,
        name: result?.name,
        role: result?.role?.role,
      };

      const tokens = await this.getTokens(
        payload.sub,
        payload.email,
        payload.name,
        payload.role,
      );

      await this.updateRefreshToken(payload.sub, tokens.refreshToken);

      return tokens;
    }

    return null;
  }

  async logout(userId: string) {
    const user = await this.usersService.updateSession(userId, null);
    return { message: 'Đã đăng xuất thành công' };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.getUserById(userId);
    const inputSession = await this.getSessionFromRefreshToken(refreshToken);

    if (user && user?.session && inputSession) {
      const sessionMatches = await bcrypt.compare(inputSession, user?.session);
      if (sessionMatches) {
        const tokens = await this.getTokens(
          user?.id,
          user?.email,
          user?.name,
          user?.role?.role,
        );
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
      }
    }

    return null;
  }

  async getTokens(userId: string, email: string, name: string, role: string) {
    //generate random crypto and add to refresh token payload
    const session = crypto.randomBytes(10).toString('hex');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role, name },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRES'),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role, session },
        {
          secret: this.configService.get<string>('REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('REFRESH_EXPIRES'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const session = await this.getSessionFromRefreshToken(refreshToken);

    await this.usersService.updateSession(userId, session);
  }

  async getSessionFromRefreshToken(refreshToken: string) {
    const decodedJwt = await this.jwtService.decode(refreshToken);
    const session = decodedJwt?.session;

    return session;
  }

  async validateUser(email: string, inputPassword: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordMatched = await bcrypt.compare(
      inputPassword,
      user?.password,
    );

    if (!isPasswordMatched) {
      return null;
    }
    const { password, ...result } = user;

    return result;
  }
}
