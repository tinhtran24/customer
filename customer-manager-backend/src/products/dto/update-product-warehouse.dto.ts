import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductWarehouse {
  @ApiProperty({
    example: {
      quantityInStock: 0,
      quantityInUse: 0,
      source: 'Hà Nội',
      price: 0,
    },
    required: false,
  })
  productWarehouse?: {
    quantityInStock: number;
    quantityInUse: number;
    source: string;
    price: number;
  };
}