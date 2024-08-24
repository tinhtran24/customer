import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { CustomerProduct } from './entities/product-customer.entity';
import { CustomerProductRepository } from './customer-product.repository';
import { CustomerProductController } from './customer-product.controller';
import { CustomerProductService } from './customer-product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerProduct]),
    DatabaseModule.forRepository([CustomerProductRepository]),
  ],
  controllers: [CustomerProductController],
  providers: [CustomerProductService],
})
export class CustomerProductModule {}
