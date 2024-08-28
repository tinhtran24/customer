import { ApiProperty } from "@nestjs/swagger";
import { CreateCustomerProductItemDto } from "./create-customer-product-item.dto";
import { CreateCustomerProductDto } from "./create-customer-product.dto";

export class CreateCustomerOrderDto {
   @ApiProperty()
   items: CreateCustomerProductItemDto[]

   @ApiProperty()
   createCustomerProduct: CreateCustomerProductDto 

}