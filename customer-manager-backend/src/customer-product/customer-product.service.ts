import { Injectable } from '@nestjs/common';
import { CustomerProduct } from "./entities/product-customer.entity";
import { BaseService } from "../core/base/base.service";
import { CustomerProductRepository } from './customer-product.repository';
import { PaginateDto } from 'src/core/base/base.dto';
import { CreateCustomerOrderDto } from './dto/create-customer-order.dto';
import { CustomerProductItemRepository } from './customer-product-items.repository';
import { QueryCustomerProductDto } from "./dto/customer-product-filter.dto";
import { BetweenDates } from "../core/helper/filter-query.decorator.util";
import { ILike } from "typeorm";

@Injectable()
export class CustomerProductService extends BaseService<CustomerProduct, CustomerProductRepository> {

    constructor(
        protected customerProductRepository: CustomerProductRepository,
        protected customerProductItemRepository: CustomerProductItemRepository
    ) {
        super(customerProductRepository);
    }

    protected enable_trash = true;
    protected enable_generate_code = true;
    protected code_prefix = 'DH';

    async dashboard(options: QueryCustomerProductDto) {
        const where: any = {}
        if (options.customerName) {
            where.customer = {
                fullName: ILike(`%${options.customerName}%`)
            }
        }
        if (options.saleName) {
            where.createdUser = { name: ILike(`%${options.saleName}%`) }
        }
        if (options.source) {
            where.customerProductItems = { source : options.source}
        }
        if (options.from && options.to) {
            where.createdAt = BetweenDates(options.from, options.to)
        }
        const data = await this.repository.findPaginate(options, where);

        let totalPrice = await this.repository.sum('price', where)
       
        return {
            data: data.items,
            totalPrice: totalPrice,
            meta: data.meta
        }
    }

    async getByCustomerId(customerId: string, options: PaginateDto) {
        return this.repository.findPaginate(options, {
            customerId
        });
    }

    async createOrder(data: CreateCustomerOrderDto) {
        const code = this.generateCode(1)
        const dataCreateCustomerOr : any = {
            ...data.createCustomerProduct,
            code: code,
        }
        
        const customerOrder = await this.repository.save(dataCreateCustomerOr, { reload: true }) 
        for (const item of data.items) {
            item.customerProductId = customerOrder.id
            await this.customerProductItemRepository.save(item, { reload: true })
        }
        return customerOrder
    }
}