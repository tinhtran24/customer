import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDate, IsUUID } from 'class-validator';
import { Contact, ENUM_STATUS_TYPE } from 'src/customers/entities/customer.entity';
import {
  FULLNAME_MUST_NOT_EMPTY, USER_INCHARGE_MUST_NOT_EMPTY,
  WARDCODE_MUST_NOT_EMPTY,
} from 'src/utils/messageConstants';
import { stringCleaner } from 'src/utils/stringCleaner';

export class CreateCustomerDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    return stringCleaner(value);
  })
  taxCode: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    return stringCleaner(value);
  })
  urn: string;

  @IsNotEmpty({ message: FULLNAME_MUST_NOT_EMPTY })
  @Transform(({ value }) => {
    return stringCleaner(value);
  })
  fullName: string;

  @IsString()
  gender: string;

  @IsString()
  status: ENUM_STATUS_TYPE;

  @IsOptional()
  @IsNumber()
  callCountNumber: number;

  @IsNumber()
  totalOrder: number;

  @IsOptional()
  @IsDate()
  lastConnected: Date;

  @IsOptional()
  @IsString()
  group: string;

  @IsOptional()
  @IsString()
  source: string;

  @IsString()
  @IsNotEmpty({ message: USER_INCHARGE_MUST_NOT_EMPTY })
  userInChargeId: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    return stringCleaner(value);
  })
  street: string;

  @IsOptional()
  contacts: Contact[];

  @IsNotEmpty({ message: WARDCODE_MUST_NOT_EMPTY })
  wardCode: string;
}
