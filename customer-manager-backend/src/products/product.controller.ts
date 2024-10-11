import { BaseController } from "../core/base/base.controller";
import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ProductService } from "./product.service";
import { Crud } from "src/core/decorator/crud.decorator";
import { CreateProductDto, UpdateProductDto } from "./dto/create-product.dto";
import { ListQueryDto } from "src/core/base/base.dto";
import { UpdateProductWarehouse } from "./dto/update-product-warehouse.dto";

@Crud({
    id: 'product',
    enabled: [
        { name: 'list', options: { allowGuest: false } },
        { name: 'detail', options: { allowGuest: false } },
        'store',
        'update',
        'delete',
        'restore',
        'deleteMulti',
        'restoreMulti',
    ],
    dtos: {
        query: ListQueryDto,
        create: CreateProductDto,
        update: UpdateProductDto,
    },
})
@Controller('product')
@ApiTags('Product API')
@ApiBearerAuth()
export class ProductController extends BaseController<ProductService> {
    constructor(protected productService: ProductService) {
        super(productService);
    }


    @Patch('/update-product-warehouse/:id')
    @ApiBody({ type: UpdateProductWarehouse })
    async updateProductWarehouse(
        @Param('id') id: string,
        @Body()
        data: any,
        ...args: any[]
    ) {
        return this.productService.updateProductWarehouse(
            id,
            data,
        );
    }
}