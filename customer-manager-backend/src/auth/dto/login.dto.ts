import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import {
  EMAIL_MUST_NOT_EMPTY,
  PASSWORD_MUST_NOT_EMPTY,
  EMAIL_MUST_VALID,
} from 'src/utils/messageConstants';

export class LoginDto {
  @IsEmail({}, { message: EMAIL_MUST_VALID })
  @IsNotEmpty({ message: EMAIL_MUST_NOT_EMPTY })
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty({ message: PASSWORD_MUST_NOT_EMPTY })
  @ApiProperty()
  password: string;
}
