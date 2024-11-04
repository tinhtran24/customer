import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import { CustomerProduct } from "./entities/product-customer.entity";
import { BaseService } from "../core/base/base.service";
import { CustomerProductRepository } from './customer-product.repository';
import { PaginateDto } from 'src/core/base/base.dto';
import { CreateCustomerOrderDto, UpdateCustomerOrderDto } from './dto/create-customer-order.dto';
import { CustomerProductItemRepository } from './customer-product-items.repository';
import { QueryChartCustomerProductDto, QueryCustomerProductDto } from "./dto/customer-product-filter.dto";
import { dateTimeFormat } from "../core/helper/filter-query.decorator.util";
import { format, parseISO } from 'date-fns';
import { Column, Workbook } from 'exceljs';
import { PassThrough } from 'stream';
import { UpdateCustomerProductBulkDto } from "./dto/update-customer-order-status.dto";
import { ProductService } from "../products/product.service";
import { DateUtil } from "../utils/date";

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
        const qb = this.repository.createQueryBuilder('CustomerProduct')
            .leftJoinAndSelect('CustomerProduct.createdUser', 'CreatedUser')
            .leftJoinAndSelect('CustomerProduct.customer', 'Customer')
            .leftJoinAndSelect('CustomerProduct.customerProductItems', 'CustomerProductItems')
            .leftJoinAndSelect('CustomerProductItems.product', 'Product')

        const qbDistinct = this.repository.createQueryBuilder('CustomerProduct')
            .select(`DISTINCT "CustomerProduct"."id"`)
            .leftJoin('CustomerProduct.createdUser', 'CreatedUser')
            .leftJoin('CustomerProduct.customer', 'Customer')
            .leftJoin('CustomerProduct.customerProductItems', 'CustomerProductItems')

        qb.where(`"CustomerProduct"."code" != :code`, { code: "ĐH_CŨ" })
        qbDistinct.where(`"CustomerProduct"."code" != :code`, { code: "ĐH_CŨ" })

        if (options.customerName) {
            qb.andWhere(`"Customer"."full_name" ILIKE :customerName`, {customerName: `%${options.customerName}%`})
            qbDistinct.andWhere(`"Customer"."full_name" ILIKE :customerName`, {customerName: `%${options.customerName}%`})
        }
        if (options.ids && options.ids.length > 0 && options.ids[0] !== "") {
            qb.andWhere(`"CustomerProduct"."id" IN (:...ids)'`, { ids: options.ids })
            qbDistinct.andWhere(`"CustomerProduct"."id" IN (:...ids)'`, { ids: options.ids })
        }
        if (options.customerStatus) {
            qb.andWhere(`"Customer"."status" ILIKE :customerStatus`, {customerStatus: `%${options.customerStatus}%`})
            qbDistinct.andWhere(`"Customer"."status" ILIKE :customerStatus`, {customerStatus: `%${options.customerStatus}%`})
        }
        if (options.saleName) {
            qb.andWhere(`"CreatedUser"."name" ILIKE :saleName`, {saleName: `%${options.saleName}%`})
            qbDistinct.andWhere(`"CreatedUser"."name" ILIKE :saleName`, {saleName: `%${options.saleName}%`})
        }

        if (options.userId) {
            qb.andWhere(`"CreatedUser"."id" = :userId`, {userId: options.userId })
            qbDistinct.andWhere(`"CreatedUser"."id" = :userId`, {userId: options.userId })
        }

        if (options.source) {
            qb.andWhere(`"CustomerProductItems"."source" = :source`, {source: options.source })
            qbDistinct.andWhere(`"CustomerProductItems"."source" = :source`, {source: options.source })
        }

        if (options.status) {
            qb.andWhere(`"CustomerProduct"."status" ILIKE :status`, {status: `%${options.status}%` })
            qbDistinct.andWhere(`"CustomerProduct"."status" ILIKE :status`, {status: `%${options.status}%` })
        }

        if (options.from && options.to) {
            qb.andWhere(`"CustomerProduct"."created_at" BETWEEN :from AND :to`, {
                from: format(parseISO(DateUtil.beginOfTheDay(options.from).toISOString()), dateTimeFormat),
                to: format(parseISO(DateUtil.endOfTheDay(options.to).toISOString()), dateTimeFormat),
            })
            qbDistinct.andWhere(`"CustomerProduct"."created_at" BETWEEN :from AND :to`, {
                from: format(parseISO(DateUtil.beginOfTheDay(options.from).toISOString()), dateTimeFormat),
                to: format(parseISO(DateUtil.endOfTheDay(options.to).toISOString()), dateTimeFormat),
            })
        }
        qb.addOrderBy(`"CustomerProduct"."updated_at"`, 'DESC')
        const page = Number(options?.page || 1) || 1;
        const perPage = Number(options?.limit || 10) || 10;
        const skip = page > 0 ? perPage * (page - 1) : 0;
        qb.limit(perPage)
        qb.offset(skip)
        const [results, total] = await qb.getManyAndCount();

        const qbSum = this.repository.createQueryBuilder('CustomerProduct')
            .select(`SUM("CustomerProduct"."price") as value`)
            .innerJoin("(" + qbDistinct.getQuery() + ")", "CustomerProductDis", `"CustomerProductDis".id = CustomerProduct.id`)
            .setParameters(qbDistinct.getParameters())
        const totalPrice = await qbSum.getRawOne()

        qbSum.addSelect(`"CustomerProduct"."status" as status`).groupBy(`"CustomerProduct"."status"`)
        const totalPriceByStatus = await qbSum.getRawMany()

        const lastPage = Math.ceil(total / perPage);
        return {
            data: results,
            totalPrice: totalPrice?.value,
            totalPriceByStatus: totalPriceByStatus,
            meta: {
                itemCount: results.length,
                totalItems: total,
                itemsPerPage: perPage,
                totalPages: lastPage,
                currentPage: page,
                next: page < lastPage ? page + 1 : null,
            },
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
            qb.where(`"CustomerProduct"."created_at" BETWEEN '${format(parseISO(DateUtil.beginOfTheDay(options.from).toISOString()), dateTimeFormat)}' AND '${format(parseISO(DateUtil.endOfTheDay(options.to).toISOString()), dateTimeFormat)}'`)
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

        const totals = [];
        data.items.forEach(x => {
            const obj = totals.find(o => o.productId === x.productId);
            if (obj) {
                obj.quantity = obj.quantity + x.quantity;
            } else {
                totals.push(x);
            }
        });
        for (const item of totals) {
            const warehouse = await this.productService.findProductWareHouseBySource(item.productId, item.source)
            if (item.quantity > warehouse.displayQuantity) {
                throw new BadRequestException(
                    `Số lượng trong kho không đủ`,
                  )
            }
            item.customerProductId = customerOrder.id
            await this.customerProductItemRepository.save(item, { reload: true })
            await this.productService.buy(item.productId, {
                productWarehouse: {
                    quantityInStock: 0,
                    quantityInUse: item.quantity,
                    source: item.source,
                    price: item.unitPrice,
                },
            }, data.createCustomerProduct.createdUserId, `Bán đơn hàng: ${customerOrder.code}`)
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
        const customerProductItems = await this.customerProductItemRepository.find(
            {
                where: {customerProductId: item}
            }
        )
        const totals = [];
        data.items.forEach(x => {
            const obj = totals.find(o => o.productId === x.productId);
            if (obj) {
                obj.quantity = obj.quantity + x.quantity;
            } else {
                totals.push(x);
            }
        });

        for(const item of customerProductItems) {
            let note = `Cập nhật đơn hàng: ${customerProduct.code}`
            if (data.updateCustomerProduct.status == 'Hoàn/Hủy' ) {
                note = `Hoàn/Hủy đơn hàng: ${customerProduct.code}`
                await this.productService.addStock(item.productId, {
                    productWarehouse: {
                        quantityInStock: item.quantity,
                        quantityInUse: 0,
                        source: item.source,
                        price: item.unitPrice,
                    }
                },  data.updateCustomerProduct.updatedUserId, note)
            } else {
                if (!totals.some(e => e.productId === item.productId)){
                    await this.productService.addStock(item.productId, {
                        productWarehouse: {
                            quantityInStock: item.quantity,
                            quantityInUse: 0,
                            source: item.source,
                            price: item.unitPrice,
                        }
                    },  data.updateCustomerProduct.updatedUserId, note)
                }
                for (const s of totals) {
                    if (!customerProductItems.some(e => e.productId === s.productId)) {
                        await this.productService.buy(s.productId, {
                            productWarehouse: {
                                quantityInStock: 0,
                                quantityInUse: s.quantity,
                                source: s.source,
                                price: s.unitPrice,
                            },
                        }, data.updateCustomerProduct.updatedUserId, note)
                    }
                    if (s.productId === item.productId) {
                        if(item.quantity > s.quantity) {
                            await this.productService.addStock(item.productId, {
                                productWarehouse: {
                                    quantityInStock: item.quantity - s.quantity,
                                    quantityInUse: 0,
                                    source: s.source,
                                    price: s.unitPrice,
                                }
                            },  data.updateCustomerProduct.updatedUserId, note)
                        } else if (item.quantity < s.quantity) {
                            await this.productService.buy(s.productId, {
                                productWarehouse: {
                                    quantityInStock: 0,
                                    quantityInUse: s.quantity - item.quantity,
                                    source: s.source,
                                    price: s.unitPrice,
                                },
                            }, data.updateCustomerProduct.updatedUserId, note)
                        }
                    }
                }
            }
        }
        const customerOrder = await this.update(item, data.updateCustomerProduct)
        await this.customerProductItemRepository.delete({customerProductId: item})
        for (const item of totals) {
            item.customerProductId = customerOrder.id
            await this.customerProductItemRepository.save(item, { reload: true })
        }
        return customerOrder
    }

    async deleteOrder(item: string, userId: string) {
        const customerProduct = await this.detail(item)
        if (!customerProduct) {
            throw new BadRequestException(
                'Đơn hàng không tồn tại',
            )
        }
       const customerProductItems = await this.customerProductItemRepository.findBy({
           customerProductId: item
       })
        const customerOrder = await this.delete(item, true)
        for (const item of customerProductItems) {
            item.customerProductId = customerOrder.id
            await this.customerProductItemRepository.remove(item)
            await this.productService.addStock(item.productId, {
                productWarehouse: {
                    quantityInStock: item.quantity,
                    quantityInUse: 0,
                    source: item.source,
                    price: item.unitPrice,
                }
            },userId, `Xóa đơn hàng: ${customerProduct.code}`)
        }
        await this.customerProductItemRepository.delete({customerProductId: item})
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
            .set({
                status: data.status
            })
            .where('"customer_product"."id" IN (:...ids)', { ids: data.ids })
            .returning("*") // returns all the column values
            .updateEntity(true)
            .execute();
        return updatedData.raw[0];
    }
}