import { ApiProperty } from "@nestjs/swagger";
import { CreateCustomerProductItemDto } from "./create-customer-product-item.dto";
import { CreateCustomerProductDto } from "./create-customer-product.dto";
import { IsUUID } from "class-validator";

export class CreateCustomerOrderDto {
   @ApiProperty()
   items: CreateCustomerProductItemDto[]

   @ApiProperty()
   createCustomerProduct: CreateCustomerProductDto
}

export class UpdateCustomerOrderDto {
   @ApiProperty()
   items: CreateCustomerProductItemDto[]

   @ApiProperty()
   createCustomerProduct: CreateCustomerProductDto 
}