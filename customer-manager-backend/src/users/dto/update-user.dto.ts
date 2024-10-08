import { IsNotEmpty, IsNumber, IsOptional, IsStrongPassword } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Exclude, Transform } from 'class-transformer';
import {
  NAME_MUST_NOT_EMPTY,
  PASSWORD_MUST_NOT_EMPTY,
  PASSWORD_NOT_STRONG,
  ROLE_MUST_NOT_EMPTY,
  ROLE_MUST_NUMBER,
} from 'src/utils/messageConstants';
import { stringCleaner } from 'src/utils/stringCleaner';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Exclude()
  email?: string;

  @IsStrongPassword(
      {
        minLength: 6,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      },
      {
        message: PASSWORD_NOT_STRONG,
      },
  )
  @IsNotEmpty({ message: PASSWORD_MUST_NOT_EMPTY })
  @ApiProperty({ name: 'password', description: 'Mât khẩu mới' })
  password?: string;

  @IsNotEmpty({ message: NAME_MUST_NOT_EMPTY })
  @Transform(({ value }) => {
    return stringCleaner(value);
  })
  name: string;

  @IsOptional()
  @IsNumber({}, { message: ROLE_MUST_NUMBER })
  @IsNotEmpty({ message: ROLE_MUST_NOT_EMPTY })
  roleId: number;
}