import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
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

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Exclude()
  email?: string;

  @Exclude()
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
