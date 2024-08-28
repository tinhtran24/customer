import {
    Entity,
    Column,
} from 'typeorm';
import { BaseEntity } from "../../core/base/base.entity";

@Entity('product')
export class Product extends BaseEntity {
    @Column()
    title: string;

    @Column()
    code: string;

    @Column()
    description: string;
}