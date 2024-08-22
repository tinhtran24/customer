import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDate, IsUUID } from 'class-validator';
import { Contact, ENUM_STATUS_TYPE } from 'src/customers/entities/customer.entity';
import {
  FULLNAME_MUST_NOT_EMPTY, USER_INCHARGE_MUST_NOT_EMPTY,
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

  @IsString()
  @ApiProperty()
  code: string;


  @IsString()
  @ApiProperty()
  gender: string;

  @IsString()
  status: ENUM_STATUS_TYPE;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  callCountNumber: number;

  @IsNumber()
  @ApiProperty()
  totalOrder: number;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  @Type(() => Date)
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
