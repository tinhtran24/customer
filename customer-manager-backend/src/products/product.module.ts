import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { Product } from "./entities/product.entity";
import { ProductRepository } from './product.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    DatabaseModule.forRepository([ProductRepository]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
