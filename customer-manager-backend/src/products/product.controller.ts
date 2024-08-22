import { Product } from "./entities/product.entity";
import { BaseController } from "../core/base/base.controller";
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from "./product.service";

@Controller('Product')
@ApiTags('Product API')
export class ProductController extends BaseController<Product>(Product, 'product') {
    relations = [];

    constructor(private readonly productService: ProductService) {
        super(productService);
    }
}