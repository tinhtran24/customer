import { Injectable } from '@nestjs/common';
import { Product } from "./entities/product.entity";
import { BaseService } from "../core/base/base.service";
import { ProductRepository } from './product.repository';
import { UpdateProductWarehouse } from './dto/update-product-warehouse.dto';
import { ProductWarehouseRepository } from './product-warehouse.repository';
import { ILike } from 'typeorm';
import { QueryProductWarehouseDto } from "./dto/product-warehouse-filter.dto";
import { QueryProductDto } from './dto/product-filter.dto';
import { ProductWarehouseLogRepository } from './product-warehouse-log.repository';
import { ProductWarehouse } from './entities/product-warehouse.entity';
import { isUndefined } from "@nestjs/common/utils/shared.utils";

@Injectable()
export class ProductService extends BaseService<Product, ProductRepository> {

    constructor(
        protected productRepository: ProductRepository,
        protected productWarehouseRepository: ProductWarehouseRepository,
        protected productWarehouseLogRepository: ProductWarehouseLogRepository,

    ) {
        super(productRepository);
    }

    protected enable_trash = true;

    async find(options: QueryProductDto, where) {
        if(!options.code && !options.title && !options.source) {
            return this.findPaginate(options, where)
        }
        const page = Number(options.page || 1) || 1;
        const perPage = Number(options.limit || 10) || 10;
        const skip = page > 0 ? perPage * (page - 1) : 0;

        const qb = this.repository.createQueryBuilder("Product")
                    .leftJoinAndSelect("Product.productWarehouses", "productWarehouses")
                    .take(perPage)
                    .skip(skip)
                    .where('1 = 1')
            
        if (options.code) {
            qb.andWhere('"Product"."code" LIKE :code', {code: `%${options.code}%`})
        }
        if (options.title) {
            qb.andWhere('"Product"."title" LIKE :title', {title: `%${options.title}%`})
        }
        if(options.source) {
            qb.andWhere('"productWarehouses"."source" LIKE :source', {source: `%${options.source}%`})
        }

        const [items, total] = await qb.getManyAndCount()
        const lastPage = Math.ceil(total / options.limit);

        return {
            items: items,
            meta: {
              itemCount: items.length,
              totalItems: total,
              itemsPerPage: options.limit,
              totalPages: lastPage,
              currentPage: page,
              next: page < lastPage ? page + 1 : null,
            },
          };
    }

    async findPaginateProductWarehouse(
        options: QueryProductWarehouseDto,
        where?: any
    ): Promise<any> {
        if(options.source) {
           where.source =  ILike(`%${options.source}%`)
        }
        if(options.productId) {
            where.productId =  options.productId
        }
        return this.productWarehouseRepository.findPaginate(options, where);
    }

    async findProductWareHouseBySource(
        id: string,
        source: string
    ): Promise<ProductWarehouse> {
        return await this.productWarehouseRepository.findOne({
            where: {
                productId: id,
                source: ILike(`%${source}%`)
            },
            relations: ['productWarehouseLogs']
        });
    }

    async addStock(
        id: string,
        updateProductWarehouseDto: UpdateProductWarehouse,
        userId: string,
        note?: string | 'Nhập hàng'
    ): Promise<Product> {
        try {
            const { productWarehouse } = updateProductWarehouseDto;
            const product = await this.productRepository.findOne({
                where: {
                    id: id,
                },
            });
            if (!product) {
                throw new Error(`Sản phẩm với ID ${id} không tồn tại`);
            }
            
            const productWarehouseResult = await this.productWarehouseRepository.findOne({
                where: {
                    productId: id,
                    source: ILike(`%${productWarehouse.source}%`)
                },
                relations: ['productWarehouseLogs']
            });

            let productWareHouseId;
            if (productWarehouse) {
                const { quantityInStock, source, price, quantityInUse } = productWarehouse;
                // Update existing product warehouse or create a new one if not present
                if (productWarehouseResult) {
                    const sumInStock = productWarehouseResult.productWarehouseLogs
                    .reduce((sum, current) => sum + current.quantityInStock, 0);

                    const sumInUse = productWarehouseResult.productWarehouseLogs
                    .reduce((sum, current) => sum + current.quantityInUse, 0);

                    const sumInput = productWarehouseResult.productWarehouseLogs.filter((e) => e.note === 'Nhập hàng')
                        .reduce((sum, current) =>  sum + current.quantityInStock, 0);

                    const quantityInStockPlus = sumInStock - sumInUse +  Number(quantityInStock)
                    productWarehouseResult.quantityInStock =  isUndefined(note) ? sumInput + Number(quantityInStock) : sumInput;
                    productWarehouseResult.displayQuantity = quantityInStockPlus;
                    productWarehouseResult.quantityInUse = sumInput - quantityInStockPlus;
                
                    await this.productWarehouseRepository.save(productWarehouseResult, { reload: true });
                    productWareHouseId = productWarehouseResult.id;
                } else {
                    const newProductWarehouse = this.productWarehouseRepository.create({
                        product: product,
                        quantityInStock,
                        quantityInUse: 0,
                        displayQuantity: quantityInStock,
                        source,
                    });
                    const result = await this.productWarehouseRepository.save(newProductWarehouse, { reload: true });
                    productWareHouseId = result.id;
                    product.price = price
                }
                const newProductWarehouseLog = this.productWarehouseLogRepository.create({
                    product: product,
                    quantityInStock,
                    quantityInUse: 0,
                    displayQuantity: quantityInStock,
                    source,
                    createdUserId: userId,
                    productWareHouseId: productWareHouseId,
                    note: note || 'Nhập hàng',
                    price,
                });
                await this.productWarehouseLogRepository.save(newProductWarehouseLog, {reload: true})
                await this.update(product.id, product);
            }
            // Return the updated product
            return product;
        } catch (error) {
            throw new Error(
                `Có lỗi khi cập nhật sản phẩm ID ${id}: ${error}`,
            );
        }
    }
    async buy(
        id: string,
        updateProductWarehouseDto: UpdateProductWarehouse,
        userId: string,
        note?: string | 'Bán hàng'
    ): Promise<Product> {
        try {
            const { productWarehouse } = updateProductWarehouseDto;
            const product = await this.productRepository.findOne({
                where: {
                    id: id,
                },
            });
            if (!product) {
                throw new Error(`Sản phẩm với ID ${id} không tồn tại`);
            }
            const productWarehouseResult = await this.productWarehouseRepository.findOne({
                where: {
                    productId: id,
                    source: ILike(`%${productWarehouse.source}%`)
                },
                relations: ['productWarehouseLogs']
            });
            let productWareHouseId;
            let displayQuantity;
            if (productWarehouse) {
                const { quantityInStock, quantityInUse, source, price } = productWarehouse;
                // Update existing product warehouse or create a new one if not present
                if (productWarehouseResult) {
                    const sumInStock = productWarehouseResult.productWarehouseLogs
                    .reduce((sum, current) => sum + current.quantityInStock, 0);

                    const sumInUse = productWarehouseResult.productWarehouseLogs
                    .reduce((sum, current) => sum + current.quantityInUse, 0);

                    const sumInUsePlus = sumInUse + Number(quantityInUse)

                    productWarehouseResult.displayQuantity = sumInStock - sumInUsePlus;
                    productWarehouseResult.quantityInUse = sumInUsePlus;

                    await this.productWarehouseRepository.save(productWarehouseResult);
                    productWareHouseId = productWarehouseResult.id;
                    displayQuantity = productWarehouseResult.displayQuantity - quantityInUse
                }
                const newProductWarehouseLog = this.productWarehouseLogRepository.create({
                    product: product,
                    quantityInStock,
                    quantityInUse: quantityInUse,
                    displayQuantity: displayQuantity,
                    source: source,
                    price: price,
                    createdUserId: userId,
                    productWareHouseId: productWareHouseId,
                    note: note
                });
                await this.productWarehouseLogRepository.save(newProductWarehouseLog, {reload: true})
                await this.productRepository.save(product);
            }
            // Return the updated product
            return product;
        } catch (error) {
            throw new Error(
                `Có lỗi khi cập nhật sản phẩm ID ${id}: ${error}`,
            );
        }
    }
    async updateProductWarehouse(
        id: string,
        updateProductWarehouseDto: UpdateProductWarehouse,
    ): Promise<Product> {
        try {
            const { productWarehouse } = updateProductWarehouseDto;
            const product = await this.productRepository.findOne({
                where: { 
                    id: id,
                },
            });
            if (!product) {
                throw new Error(`Sản phẩm với ID ${id} không tồn tại`);
            }
            const productWarehouseResult = await this.productWarehouseRepository.findOne({
                where: {
                    productId: id,
                    source: ILike(`%${productWarehouse.source}%`)
                }
            });

            if (productWarehouse) {
                const { quantityInStock, quantityInUse, source, price } = productWarehouse;
                // Update existing product warehouse or create a new one if not present
                if (productWarehouseResult) {
                    productWarehouseResult.quantityInStock = Number(quantityInStock);
                    productWarehouseResult.quantityInUse = Number(quantityInUse);
                    productWarehouseResult.displayQuantity = Number(quantityInStock - quantityInUse);
                    await this.productWarehouseRepository.save(productWarehouseResult);
                } else {
                    const newProductWarehouse = this.productWarehouseRepository.create({
                        product: product,
                        quantityInStock,
                        quantityInUse,
                        displayQuantity: quantityInStock - quantityInUse,
                        source
                    });
                    await this.productWarehouseRepository.save(newProductWarehouse);
                    product.price = price
                }
                await this.productRepository.save(product);
            }
            // Return the updated product
            return product;
        } catch (error) {
            throw new Error(
            `Có lỗi khi cập nhật sản phẩm ID ${id}: ${error}`,
          );
        }
    }
}