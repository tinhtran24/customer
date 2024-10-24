import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { Product } from "./entities/product.entity";
import { ProductRepository } from './product.repository';
import { DatabaseModule } from 'src/database/database.module';
import { ProductWarehouse } from './entities/product-warehouse.entity';
import { ProductWarehouseRepository } from './product-warehouse.repository';
import { ProductWarehouseLog } from './entities/product-warerhouse-log.entity';
import { ProductWarehouseLogRepository } from './product-warehouse-log.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    DatabaseModule.forRepository([ProductRepository]),
    TypeOrmModule.forFeature([ProductWarehouse]),
    DatabaseModule.forRepository([ProductWarehouseRepository]),
    TypeOrmModule.forFeature([ProductWarehouseLog]),
    DatabaseModule.forRepository([ProductWarehouseLogRepository]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
