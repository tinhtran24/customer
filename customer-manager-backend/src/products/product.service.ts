import { Injectable } from '@nestjs/common';
import { Product } from "./entities/product.entity";
import { BaseService } from "../core/base/base.service";
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService extends BaseService<Product, ProductRepository> {

    constructor(protected productRepository: ProductRepository) {
        super(productRepository);
    }

    protected enable_trash = true;

    
}