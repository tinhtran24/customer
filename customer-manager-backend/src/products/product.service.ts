import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from "./entities/product.entity";
import { BaseService } from "../core/base/base.service";
import { CreateProductDto } from "./dto/create-product.dto";

@Injectable()
export class ProductService extends BaseService<Product> {
    name = 'Product';

    constructor(
        @InjectRepository(Product)
        private readonly roomRepo: Repository<Product>,
    ) {
        super(roomRepo);
    }

    async create(input: CreateProductDto) {
        return this.repo.create(input).save();
    }
}