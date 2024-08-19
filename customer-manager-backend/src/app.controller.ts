import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from '@nestjs/common';
import { Public } from 'src/auth/auth.decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
