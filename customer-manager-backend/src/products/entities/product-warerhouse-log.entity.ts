import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Product } from "./product.entity";
import { BaseEntity } from "../../core/base/base.entity";
import User from "src/users/entities/user.entity";
import { ProductWarehouse } from "./product-warehouse.entity";

@Entity('product_warehouse_log')
export class ProductWarehouseLog extends BaseEntity {
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

  @Index()
  @Column({ name: 'created_user' })
  createdUserId: string;

  @ManyToOne(() => User, { cascade: false })
  @JoinColumn({ name: 'created_user' })
  createdUser: User;

  @ManyToOne(() => ProductWarehouse, (ProductWarehouse) => ProductWarehouse.productWarehouseLogs)
  @JoinColumn({name: 'product_warehouse_id'})
  productWarehouse: ProductWarehouse;

  @Column({name: 'product_warehouse_id'})
  productWareHouseId: string
}