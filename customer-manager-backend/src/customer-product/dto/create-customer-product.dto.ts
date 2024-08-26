import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsNotEmpty, IsUUID, IsString, IsOptional } from 'class-validator';
import { stringCleaner } from 'src/utils/stringCleaner';

export class CreateCustomerProductDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    customerId: string

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    createdUserId: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    productId: string

    @IsString()
    @ApiProperty()
    @Transform(({ value }) => {
      return stringCleaner(value);
    })
    street: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    quality: number

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
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    shippingWardCode: string;
}

export class UpdateCustomerProductDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    customerId: string

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    productId: string

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
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    shippingWardCode: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    updatedUserId: string;
}