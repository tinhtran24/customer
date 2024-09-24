import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerProduct } from "./entities/product-customer.entity";
import { BaseService } from "../core/base/base.service";
import { CustomerProductRepository } from './customer-product.repository';
import { PaginateDto } from 'src/core/base/base.dto';
import { CreateCustomerOrderDto, UpdateCustomerOrderDto } from './dto/create-customer-order.dto';
import { CustomerProductItemRepository } from './customer-product-items.repository';
import { QueryChartCustomerProductDto, QueryCustomerProductDto } from "./dto/customer-product-filter.dto";
import { BetweenDates } from "../core/helper/filter-query.decorator.util";
import { ILike, Not } from "typeorm";
import { format } from 'date-fns';

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
    protected code_prefix = 'ĐH';

    async dashboard(options: QueryCustomerProductDto) {
        const where: any = {}
        if (options.customerName) {
            where.customer = {
                fullName: ILike(`%${options.customerName}%`)
            }
        }
        if (options.customerStatus) {
            where.customer = {
                status: ILike(`%${options.customerStatus}%`)
            }
        }
        if (options.saleName) {
            where.createdUser = { name: ILike(`%${options.saleName}%`) }
        }

        if (options.userId) {
            where.createdUser = { id: options.userId }
        }

        if (options.source) {
            where.customerProductItems = { source : options.source}
        }

        if (options.from && options.to) {
            where.createdAt = BetweenDates(options.from, options.to)
        }
        where.code = Not("ĐH_CŨ")
        const data = await this.repository.findPaginate(options, where);

        let totalPrice = await this.repository.sum('price', where)
       
        return {
            data: data.items,
            totalPrice: totalPrice,
            meta: data.meta
        }
    }


    async chart(options: QueryChartCustomerProductDto) {
        const qb = this.repository.createQueryBuilder('CustomerProduct')
        .leftJoin('CustomerProduct.createdUser', 'CreatedUser')
        .leftJoin('CustomerProduct.customerProductItems', 'CustomerProductItems')
        let groupBy
        if(!options.year && !options.from && !options.to) {
            qb.select([`concat('Tháng ', "CustomerProduct"."month") as key`])
            qb.where(`"CustomerProduct"."year" = ${new Date().getFullYear}`)
            groupBy = '"CustomerProduct"."month"'
        }
        if (options.year) {
            qb.select([`concat('Tháng ', "CustomerProduct"."month") as key`])
            qb.where(`"CustomerProduct"."year" = ${options.year}`)
            groupBy = '"CustomerProduct"."month"'
        } else if (options.from && options.to) {
                qb.select(['"CustomerProduct"."buy_date" as key'])
                qb.where(`"CustomerProduct"."created_at" BETWEEN '${options.from}' AND '${options.to}'`)
                groupBy = '"CustomerProduct"."buy_date"'
        }
        if (options.saleName) {
            qb.andWhere(`"CreatedUser"."name" ILIKE '%${options.saleName}%'`)
        }
        if (options.source) {
            qb.andWhere(`"CustomerProductItems"."source" ILIKE '%${options.source}%'`)
        }
        qb.andWhere(`"CustomerProduct"."code" !== 'ĐH_CŨ'`)
        qb.addSelect('SUM("CustomerProduct"."price") as value').groupBy(groupBy)
        const result = await qb.getRawMany();
       
        return {
            data: result
        }
    }
    

    async getByCustomerId(customerId: string, options: PaginateDto) {
        return this.repository.findPaginate(options, {
            customerId
        });
    }

    async createOrder(data: CreateCustomerOrderDto) {
        const dateObj = new Date();
        const dataCustomerOrder = {
            ...data.createCustomerProduct,
            year: dateObj.getFullYear(),
            month: dateObj.getMonth() + 1,
            buyDate: format(dateObj, 'yyyy-MM-dd')
        }
        const customerOrder = await this.create(dataCustomerOrder)
        for (const item of data.items) {
            item.customerProductId = customerOrder.id
            await this.customerProductItemRepository.save(item, { reload: true })
        }
        return customerOrder
    }

    async updateOrder(item: string, data: UpdateCustomerOrderDto) {
        const customerProduct = await this.detail(item)
        if (!customerProduct) {
            throw new BadRequestException(
              'Đơn hàng không tồn tại',
            )
          }
        const customerOrder = await this.update(item, data.createCustomerProduct)
        const oldItem = customerOrder.customerProductItems;
        for (const item of oldItem) {
            await this.customerProductItemRepository.delete(item.id)
        }
        for (const item of data.items) {
            item.customerProductId = customerOrder.id
            await this.customerProductItemRepository.save(item, { reload: true })
        }
        return customerOrder
    }
}