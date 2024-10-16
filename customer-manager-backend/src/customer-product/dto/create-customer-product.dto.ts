import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsUUID, IsString } from 'class-validator';

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
    paymentMethod: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    shipMethod: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    status: string
}

export class UpdateCustomerProductDto {
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
    updatedUserId: string;

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
    paymentMethod: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    shipMethod: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    status: string
}