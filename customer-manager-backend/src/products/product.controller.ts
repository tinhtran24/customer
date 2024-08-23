import { BaseController } from "../core/base/base.controller";
import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductService } from "./product.service";
import { Crud } from "src/core/decorator/crud.decorator";
import { CreateProductDto, UpdateProductDto } from "./dto/create-product.dto";

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
        create: CreateProductDto,
        update: UpdateProductDto,
    },
})
@Controller('Product')
@ApiTags('Product API')
@ApiBearerAuth()
export class ProductController extends BaseController<ProductService> {
    constructor(protected productService: ProductService) {
        super(productService);
    }
}