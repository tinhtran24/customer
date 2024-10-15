import { ApiProperty } from "@nestjs/swagger";
import { CreateCustomerProductItemDto } from "./create-customer-product-item.dto";
import { CreateCustomerProductDto, UpdateCustomerProductDto } from "./create-customer-product.dto";

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
   updateCustomerProductDto: UpdateCustomerProductDto
}