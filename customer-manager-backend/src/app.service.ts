import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Đã kết nối tới máy chủ thành công!';
  }
}
