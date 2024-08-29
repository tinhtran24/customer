import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDate, IsUUID } from 'class-validator';
import {
  FULLNAME_MUST_NOT_EMPTY, PHONE_NUMBER_MUST_NOT_EMPTY, USER_INCHARGE_MUST_NOT_EMPTY,
  WARDCODE_MUST_NOT_EMPTY,
} from 'src/utils/messageConstants';
import { Exclude, Transform } from 'class-transformer';
import { Contact, ENUM_STATUS_TYPE } from 'src/customers/entities/customer.entity';
import { stringCleaner } from 'src/utils/stringCleaner';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @IsNotEmpty({ message: FULLNAME_MUST_NOT_EMPTY })
  @ApiProperty()
  @Transform(({ value }) => {
    return stringCleaner(value);
  })
  fullName: string;

  @IsNotEmpty({ message: PHONE_NUMBER_MUST_NOT_EMPTY })
  @Transform(({ value }) => {
    return stringCleaner(value);
  })
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @ApiProperty()
  gender: string;

  @IsString()
  @ApiProperty()
  status: ENUM_STATUS_TYPE;

  @IsNumber()
  @ApiProperty()
  callCountNumber: number;

  @IsNumber()
  @ApiProperty()
  totalOrder: number;

  @IsDate()
  @ApiProperty()
  lastConnected: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  group: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  source: string;

  @IsString()
  @IsNotEmpty({ message: USER_INCHARGE_MUST_NOT_EMPTY })
  @ApiProperty()
  userInChargeId: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  @Transform(({ value }) => {
    return stringCleaner(value);
  })
  street: string;

  @IsOptional()
  @ApiProperty()
  contacts: Contact[];

  @IsNotEmpty({ message: WARDCODE_MUST_NOT_EMPTY })
  @ApiProperty()
  wardCode: string;
}
