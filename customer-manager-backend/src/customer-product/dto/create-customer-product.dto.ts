import { IsNumber, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCustomerProductDto {
    @IsUUID()
    @IsNotEmpty()
    customerId: string

    @IsUUID()
    @IsNotEmpty()
    createdUserId: string;

    @IsUUID()
    @IsNotEmpty()
    productId: string

    @IsNumber()
    @IsNotEmpty()
    quality: number
}

export class UpdateCustomerProductDto {
    @IsUUID()
    @IsNotEmpty()
    customerId: string

    @IsUUID()
    @IsNotEmpty()
    productId: string

    @IsNumber()
    @IsNotEmpty()
    quality: number

    @IsUUID()
    @IsNotEmpty()
    updatedUserId: string;
}