import { IsNumber, IsNotEmpty, IsUUID, IsString } from 'class-validator';

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

    @IsNumber()
    @IsNotEmpty()
    price: number

    @IsString()
    @IsNotEmpty()
    PaymentMethod: string;
  
    @IsString()
    @IsNotEmpty()
    ShipMethod: string;
  
    @IsString()
    @IsNotEmpty()
    shippingWardCode: string;
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
    price: number

    @IsNumber()
    @IsNotEmpty()
    quality: number

    @IsString()
    @IsNotEmpty()
    PaymentMethod: string;
  
    @IsString()
    @IsNotEmpty()
    ShipMethod: string;
  
    @IsString()
    @IsNotEmpty()
    shippingWardCode: string;

    @IsUUID()
    @IsNotEmpty()
    updatedUserId: string;
}