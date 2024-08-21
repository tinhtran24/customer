import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';

@Entity('product')
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    label: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}