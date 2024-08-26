import { Injectable } from '@nestjs/common';
import { CustomerProduct } from "./entities/product-customer.entity";
import { BaseService } from "../core/base/base.service";
import { CustomerProductRepository } from './customer-product.repository';
import { PaginateDto } from 'src/core/base/base.dto';

@Injectable()
export class CustomerProductService extends BaseService<CustomerProduct, CustomerProductRepository> {

    constructor(protected customerProductRepository: CustomerProductRepository) {
        super(customerProductRepository);
    }

    protected enable_trash = true;

    async getByCustomerId(customerId: string, options: PaginateDto) {
        return this.repository.findPaginate(options, {
            customerId
        });
    }
}