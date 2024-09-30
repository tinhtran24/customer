import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDate, IsUUID, IsArray } from 'class-validator';
import {
  FULLNAME_MUST_NOT_EMPTY, PHONE_NUMBER_MUST_NOT_EMPTY, USER_INCHARGE_MUST_NOT_EMPTY,
} from 'src/utils/messageConstants';
import { Transform } from 'class-transformer';
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

  @IsOptional()
  @IsString()
  @ApiProperty()
  gender: string;

  @IsString()
  @ApiProperty()
  status: string;

  @IsNumber()
  @ApiProperty()
  callCountNumber: number;

  @IsOptional()
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
  note: string;

  @IsOptional()
  @ApiProperty()
  wardCode: string;
}


export class UpdateCustomerBulkDto {
  @IsArray()
  @ApiProperty()
  ids: string[]

  @IsString()
  @ApiProperty()
  status: string;
}