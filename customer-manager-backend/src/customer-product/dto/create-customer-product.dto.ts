import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsNotEmpty, IsUUID, IsString } from 'class-validator';
import { stringCleaner } from 'src/utils/stringCleaner';

export class CreateCustomerProductDto {
    @IsString()
    @ApiProperty()
    code: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    customerId: string

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    createdUserId: string;

    @IsString()
    @ApiProperty()
    street: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    price: number

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    PaymentMethod: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    ShipMethod: string;
}

export class UpdateCustomerProductDto {
    @IsString()
    @ApiProperty()
    code: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    customerId: string

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    price: number

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    quality: number

    @IsString()
    @ApiProperty()
    @Transform(({ value }) => {
      return stringCleaner(value);
    })
    street: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    PaymentMethod: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    ShipMethod: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    updatedUserId: string;
}