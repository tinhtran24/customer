import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
export interface ErrorResponse {
  message: string;
  statusCode: HttpStatus;
}
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private excludeHttpStatusList = [404, 400, 403, 401, 409, 429];

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let errorResponse: ErrorResponse = {
      message: '',
      statusCode: status,
    };

    switch (status) {
      case 503:
        errorResponse.message = 'Lỗi dịch vụ';
        break;

      case 500:
        errorResponse.message = 'Lỗi máy chủ';
        break;
    }

    if (this.excludeHttpStatusList.includes(status)) {
      response.status(status).json(exception.getResponse());
    } else {
      response.status(status).json(errorResponse);
    }
  }
}
