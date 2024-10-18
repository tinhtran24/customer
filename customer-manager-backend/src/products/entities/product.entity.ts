import {
    Entity,
    Column,
    ManyToMany,
    ManyToOne,
    OneToMany
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

    @Column({ default: 0 })
    price: number;


    @OneToMany(() => ProductWarehouse, (productWarehouse) => productWarehouse.product)
    productWarehouses: ProductWarehouse[];
}