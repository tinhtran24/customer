import { Injectable } from '@nestjs/common';
import { Product } from "./entities/product.entity";
import { BaseService } from "../core/base/base.service";
import { ProductRepository } from './product.repository';
import { UpdateProductWarehouse } from './dto/update-product-warehouse.dto';
import { ProductWarehouseRepository } from './product-warehouse.repository';
import { ILike } from 'typeorm';

@Injectable()
export class ProductService extends BaseService<Product, ProductRepository> {

    constructor(
        protected productRepository: ProductRepository,
        protected productWarehouseRepository: ProductWarehouseRepository,
    ) {
        super(productRepository);
    }

    protected enable_trash = true;

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

            const productWarehouseResult = await this.productRepository.findOne({
                where: {
                    id: id,
                    productWarehouse: {
                        source: ILike(`%${productWarehouse.source}%`)
                    }
                },
                relations: ['productWarehouse'],
            });


            if (productWarehouseResult && productWarehouse) {
            const { quantityInStock, quantityInUse, source, price } = productWarehouse;
            // Update existing product warehouse or create a new one if not present
            if (product.productWarehouse) {
                product.productWarehouse.quantityInStock = quantityInStock;
                product.productWarehouse.quantityInUse = quantityInUse;
                product.productWarehouse.displayQuantity = quantityInStock - quantityInUse;
                await this.productWarehouseRepository.save(product.productWarehouse);
            } else {
                const newProductWarehouse = this.productWarehouseRepository.create({
                    product: product,
                    quantityInStock,
                    quantityInUse,
                    displayQuantity: quantityInStock - quantityInUse,
                    source
                });
                await this.productWarehouseRepository.save(newProductWarehouse);
                product.productWarehouse = newProductWarehouse;
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