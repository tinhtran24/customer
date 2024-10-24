import { BaseController } from "../core/base/base.controller";
import { Body, Controller, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ProductService } from "./product.service";
import { Crud } from "src/core/decorator/crud.decorator";
import { CreateProductDto, UpdateProductDto } from "./dto/create-product.dto";
import { ListQueryDto } from "src/core/base/base.dto";
import { UpdateProductWarehouse } from "./dto/update-product-warehouse.dto";
import { QueryCustomertDto } from "../customers/dto/filter-customer.dto";
import { QueryProductWarehouseDto } from "./dto/product-warehouse-filter.dto";
import { QueryProductDto } from "./dto/product-filter.dto";

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
        query: QueryProductDto,
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
    @Get('')
    async listProductPaging(
        @Query() options: QueryProductDto,
        @Request() req
    ) {
        let where = {}
        return this.productService.find(options, where);
    }

    @Get('product-warehouse')
    async listPaging(
        @Query() options: QueryProductWarehouseDto,
        @Request() req
    ) {
        return this.productService.findPaginateProductWarehouse(options, {});
    }

    @Post('/product-warehouse/:id')
    @ApiBody({ type: UpdateProductWarehouse })
    async addStock(
        @Param('id') id: string,
        @Request() req,
        @Body()
            data: any,
        ...args: any[]
    ) {
        return this.productService.addStock(
            id,
            data,
            req.user['userId']
        );
    }

    @Patch('/product-warehouse/:id')
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