import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import { CustomerProduct } from "./entities/product-customer.entity";
import { BaseService } from "../core/base/base.service";
import { CustomerProductRepository } from './customer-product.repository';
import { PaginateDto } from 'src/core/base/base.dto';
import { CreateCustomerOrderDto, UpdateCustomerOrderDto } from './dto/create-customer-order.dto';
import { CustomerProductItemRepository } from './customer-product-items.repository';
import { QueryChartCustomerProductDto, QueryCustomerProductDto } from "./dto/customer-product-filter.dto";
import { BetweenDates } from "../core/helper/filter-query.decorator.util";
import { ILike, In, Not } from "typeorm";
import { format } from 'date-fns';
import { Column, Workbook } from 'exceljs';
import { PassThrough } from 'stream';
import { UpdateCustomerProductBulkDto } from "./dto/update-customer-order-status.dto";
import { ProductService } from "../products/product.service";

@Injectable()
export class CustomerProductService extends BaseService<CustomerProduct, CustomerProductRepository> {

    constructor(
        protected customerProductRepository: CustomerProductRepository,
        protected customerProductItemRepository: CustomerProductItemRepository,
        protected productService: ProductService,

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
        if (options.ids && options.ids.length > 0 && options.ids[0] !== "") {
            where.id = In(options.ids)
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

        if (options.status) {
            where.status = ILike(`%${options.status}%`)
        }

        if (options.from && options.to) {
            where.createdAt = BetweenDates(options.from, options.to)
        }
        where.code = Not("ĐH_CŨ")
        const data = await this.repository.findPaginate(options, where);

        const orders = await this.repository.find( {
            where: where,
            select : ["id", "price"]
        });
        let totalPrice = 0
        for (const  order of orders) {
            totalPrice += order.price
        }

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
        if (options.userId) {
            qb.andWhere(`"CustomerProduct"."created_user" = '${options.userId}'`)
        }
        if (options.source) {
            qb.andWhere(`"CustomerProductItems"."source" ILIKE '%${options.source}%'`)
        }
        if (options.status) {
            qb.andWhere(`"CustomerProduct"."status" ILIKE '%${options.status}%'`)
        }
        qb.andWhere(`"CustomerProduct"."code" != 'ĐH_CŨ'`)
        qb.addSelect(`SUM("CustomerProduct"."price") as value`).groupBy(groupBy)
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
            await this.productService.buy(item.productId, {
                productWarehouse: {
                    quantityInStock: 0,
                    quantityInUse: item.quantity,
                    source: item.source,
                    price: item.unitPrice,
                }
            })
        }
        return customerOrder
    }

    async updateOrder(item: string, data: any) {
        const customerProduct = await this.detail(item)
        if (!customerProduct) {
            throw new BadRequestException(
              'Đơn hàng không tồn tại',
            )
        }
        const customerOrder = await this.update(item, data.updateCustomerProduct)
        await this.customerProductItemRepository.delete({customerProductId: item})
        for (const item of data.items) {
            item.customerProductId = customerOrder.id
            await this.customerProductItemRepository.save(item, { reload: true })
            if(data.updateCustomerProduct.status == 'Hoàn/Hủy') {
                await this.productService.addStock(item.productId, {
                    productWarehouse: {
                        quantityInStock: item.quantity,
                        quantityInUse: 0,
                        source: item.source,
                        price: item.unitPrice,
                    }
                })
            }
        }
        return customerOrder
    }

    async export(columns: Partial<Column>[], data: Array<Record<string, any>>, filename: string) {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('donhang');
        worksheet.columns = columns;
        worksheet.addRows(data);
        const stream = new PassThrough();
        await workbook.xlsx.write(stream);
        return new StreamableFile(stream, {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            disposition: 'attachment; filename=' + filename
        });
    }

    async updateBulk (data: UpdateCustomerProductBulkDto) {
        const updatedData = await this.repository.createQueryBuilder('CustomerProduct')
            .update(CustomerProduct)
            .set({ status: data.status })
            .where('"customer_product"."id" IN (:...ids)', { ids: data.ids })
            .returning("*") // returns all the column values
            .updateEntity(true)
            .execute();
        return updatedData.raw[0];
    }
}