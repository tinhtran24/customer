import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  ConflictException,
  NotFoundException,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/auth/auth.decorators';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {
  EMAIL_OR_PASSWORD_WRONG,
  REFRESH_TOKEN_EXPIRES,
  USER_ALREADY_EXISTED,
} from 'src/utils/messageConstants';
import { RefreshTokenDto } from 'src/auth/dto/refreshToken.dto';
import { RefreshAuthGuard } from 'src/auth/refresh.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from "./jwt.guard";

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ result: string }> {
    const newUser = await this.authService.signUp(createUserDto);

    if (!newUser) {
      throw new ConflictException(USER_ALREADY_EXISTED);
    }

    return newUser;
  }

  @Post('login')
  @Public()
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const loginUser = await this.authService.login(loginDto);

    if (!loginUser) {
      throw new NotFoundException(EMAIL_OR_PASSWORD_WRONG);
    }
    return loginUser;
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req: any) {
    return req?.user
  }

  @Get('logout')
  async logout(@Request() req) {
    return this.authService.logout(req?.user['userId']);
  }

  @Post('change-password')
  @ApiBearerAuth()
  async changePassword(
    @Body() changePassDto: ChangePasswordDto,
    @Request() req,
  ) {
    return this.authService.changePassword(req?.user['userId'], changePassDto);
  }

  @UseGuards(RefreshAuthGuard)
  @Public()
  @Post('refresh')
  async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Request() req,
  ) {
    const newTokens = await this.authService.refreshTokens(
      req?.user?.userId,
      refreshTokenDto.refreshToken,
    );

    if (!newTokens) {
      await this.authService.logout(req?.user?.userId);
      throw new ForbiddenException(REFRESH_TOKEN_EXPIRES);
    }

    return newTokens;
  }
}
