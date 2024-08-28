import { Injectable } from '@nestjs/common';
import { CustomerProduct, CustomerProductItem } from "./entities/product-customer.entity";
import { BaseService } from "../core/base/base.service";
import { CustomerProductRepository } from './customer-product.repository';
import { PaginateDto } from 'src/core/base/base.dto';
import { CreateCustomerOrderDto } from './dto/create-customer-order.dto';
import { CustomerProductItemRepository } from './customer-product-items.repository';

@Injectable()
export class CustomerProductService extends BaseService<CustomerProduct, CustomerProductRepository> {

    constructor(
        protected customerProductRepository: CustomerProductRepository,
        protected customerProductItemRepository: CustomerProductItemRepository
    ) {
        super(customerProductRepository);
    }

    protected enable_trash = true;

    async getByCustomerId(customerId: string, options: PaginateDto) {
        return this.repository.findPaginate(options, {
            customerId
        });
    }

    async createOrder(data: CreateCustomerOrderDto) {
        const customerOrder = await this.repository.save(data.createCustomerProduct, { reload: true }) 
        for (const item of data.items) {
            item.customerProductId = customerOrder.id
            await this.customerProductItemRepository.save(item, { reload: true })
        }
        return customerOrder
    }
}