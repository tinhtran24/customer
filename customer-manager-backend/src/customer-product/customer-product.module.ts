import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { CustomerProduct } from './entities/product-customer.entity';
import { CustomerProductRepository } from './customer-product.repository';
import { CustomerProductController } from './customer-product.controller';
import { CustomerProductService } from './customer-product.service';
import { CustomerProductItemRepository } from './customer-product-items.repository';
import { ProductWarehouseRepository } from "../products/product-warehouse.repository";
import { ProductService } from "../products/product.service";
import { ProductRepository } from "../products/product.repository";
import { ProductWarehouseLogRepository } from 'src/products/product-warehouse-log.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerProduct]),
    DatabaseModule.forRepository([CustomerProductRepository]),
    DatabaseModule.forRepository([CustomerProductItemRepository]),
    DatabaseModule.forRepository([ProductWarehouseRepository]),
    DatabaseModule.forRepository([ProductRepository]),
    DatabaseModule.forRepository([ProductWarehouseLogRepository]),
  ],
  controllers: [CustomerProductController],
  providers: [CustomerProductService, ProductService],
})
export class CustomerProductModule {}
