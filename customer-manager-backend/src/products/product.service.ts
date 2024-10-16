import { Injectable } from '@nestjs/common';
import { Product } from "./entities/product.entity";
import { BaseService } from "../core/base/base.service";
import { ProductRepository } from './product.repository';
import { UpdateProductWarehouse } from './dto/update-product-warehouse.dto';
import { ProductWarehouseRepository } from './product-warehouse.repository';
import { ILike } from 'typeorm';
import { QueryTaskDto } from "../task/dto/filter.dto";
import { QueryProductWarehouseDto } from "./dto/product-warehouse-filter.dto";

@Injectable()
export class ProductService extends BaseService<Product, ProductRepository> {

    constructor(
        protected productRepository: ProductRepository,
        protected productWarehouseRepository: ProductWarehouseRepository,
    ) {
        super(productRepository);
    }

    protected enable_trash = true;

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
    async addStock(
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
                const { quantityInStock, source, price } = productWarehouse;
                // Update existing product warehouse or create a new one if not present
                if (productWarehouseResult) {
                    productWarehouseResult.quantityInStock += quantityInStock;
                    productWarehouseResult.displayQuantity += quantityInStock;
                    await this.productWarehouseRepository.save(productWarehouseResult, { reload: true });
                } else {
                    const newProductWarehouse = this.productWarehouseRepository.create({
                        product: product,
                        quantityInStock,
                        quantityInUse: 0,
                        displayQuantity: quantityInStock,
                        source
                    });
                    await this.productWarehouseRepository.save(newProductWarehouse, { reload: true });
                    product.price = price
                }
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
                    productWarehouseResult.quantityInUse += quantityInUse;
                    productWarehouseResult.displayQuantity -= quantityInUse;
                    await this.productWarehouseRepository.save(productWarehouseResult);
                } else {
                    const newProductWarehouse = this.productWarehouseRepository.create({
                        product: product,
                        quantityInStock,
                        quantityInUse: 0,
                        displayQuantity: quantityInStock,
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
                    productWarehouseResult.quantityInStock = quantityInStock;
                    productWarehouseResult.quantityInUse = quantityInUse;
                    productWarehouseResult.displayQuantity = quantityInStock - quantityInUse;
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