import { Injectable } from '@nestjs/common';
import { CustomerProduct } from "./entities/product-customer.entity";
import { BaseService } from "../core/base/base.service";
import { CustomerProductRepository } from './customer-product.repository';

@Injectable()
export class CustomerProductService extends BaseService<CustomerProduct, CustomerProductRepository> {

    constructor(protected customerProductRepository: CustomerProductRepository) {
        super(customerProductRepository);
    }

    protected enable_trash = true;

    
}