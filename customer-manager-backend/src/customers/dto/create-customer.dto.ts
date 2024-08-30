import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Contact } from 'src/customers/entities/customer.entity';
import {
  FULLNAME_MUST_NOT_EMPTY, PHONE_NUMBER_MUST_NOT_EMPTY, USER_INCHARGE_MUST_NOT_EMPTY,
  WARDCODE_MUST_NOT_EMPTY,
} from 'src/utils/messageConstants';
import { stringCleaner } from 'src/utils/stringCleaner';

export class CreateCustomerDto {
  @IsNotEmpty({ message: FULLNAME_MUST_NOT_EMPTY })
  @Transform(({ value }) => {
    return stringCleaner(value);
  })
  @ApiProperty()
  fullName: string;

  @IsNotEmpty({ message: PHONE_NUMBER_MUST_NOT_EMPTY })
  @Transform(({ value }) => {
    return stringCleaner(value);
  })
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @ApiProperty()
  code: string;


  @IsString()
  @ApiProperty()
  gender: string;

  @IsString()
  @ApiProperty()
  status: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  callCountNumber: number;

  @IsNumber()
  @ApiProperty()
  totalOrder: number;

  @IsOptional()
  @IsDate()
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
  @ApiProperty()
  @IsNotEmpty({ message: USER_INCHARGE_MUST_NOT_EMPTY })
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
