import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Product } from "./product.entity";
import { BaseEntity } from "../../core/base/base.entity";
import { ProductWarehouseLog } from "./product-warerhouse-log.entity";

@Entity('product_warehouse')
export class ProductWarehouse extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.productWarehouses)
  @JoinColumn({name: 'product_id'})
  product: Product;

  @Column({name: 'product_id'})
  productId: string

  @Column({ name: 'quantity_in_stock' })
  quantityInStock: number;

  @Column({ name: 'quantity_in_use' })
  quantityInUse: number;

  @Column({ name: 'display_quantity' })
  displayQuantity: number;

  @Column({ default: 0 })
  price: number;

  @Column({ name: 'source', nullable: true })
  source: string

  @OneToMany(() => ProductWarehouseLog, (productWarehouse) => productWarehouse.productWarehouse)
  productWarehouseLogs: ProductWarehouseLog[];
}