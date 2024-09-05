import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateCustomerProductItemDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    productId: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    quantity: number;

    @IsUUID()
    customerProductId: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    unitPrice: number

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    source: string
}