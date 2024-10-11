import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Product } from "./product.entity";
import { BaseEntity } from "../../core/base/base.entity";

@Entity('product_warehouse')
export class ProductWarehouse extends BaseEntity {
  @OneToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product;

  @Column({ name: 'quantity_in_stock' })
  quantityInStock: number;

  @Column({ name: 'quantity_in_use' })
  quantityInUse: number;

  @Column({ name: 'display_quantity' })
  displayQuantity: number;

  @Column({ name: 'source', nullable: true })
  source: string
}