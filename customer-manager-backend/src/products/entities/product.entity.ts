import {
    Entity,
    Column,
    OneToOne,
} from 'typeorm';
import { BaseEntity } from "../../core/base/base.entity";
import { ProductWarehouse } from './product-warehourse.entity';

@Entity('product')
export class Product extends BaseEntity {
    @Column()
    title: string;

    @Column()
    code: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @OneToOne(
        () => ProductWarehouse,
        (productWarehouse) => productWarehouse.product,
      )
    productWarehouse: ProductWarehouse;
}