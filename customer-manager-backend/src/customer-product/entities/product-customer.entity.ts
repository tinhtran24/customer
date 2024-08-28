import {
    Entity,
    Column,
    JoinColumn,
    Index,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { BaseEntity } from "../../core/base/base.entity";
import Customer from 'src/customers/entities/customer.entity';
import User from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity('customer_product')
export class CustomerProduct extends BaseEntity {
  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, { cascade: false })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(() => CustomerProductItem, (cartItem) => cartItem.customerProduct, { cascade: true })
  customerProductItems: CustomerProductItem[];

  @Column({ name: 'price' })
  price: number;

  @Column({ name: 'payment_method' })
  PaymentMethod: string;

  @Column({ name: 'ship_method' })
  ShipMethod: string;

  @Column({ name: 'street' })
  street: string;

  @Index()
  @Column({ name: 'created_user' })
  createdUserId: string;

  @ManyToOne(() => User, { cascade: false })
  @JoinColumn({ name: 'created_user' })
  createdUser: User;

  @Index()
  @Column({ name: 'updated_user', nullable: true })
  updatedUserId: string;

  @ManyToOne(() => User, { cascade: false })
  @JoinColumn({ name: 'updated_user' })
  updatedUser: User;
}

@Entity('customer_product_item')
export class CustomerProductItem extends BaseEntity {
  @Column({ name: 'customer_product_id' })
  customerProductId: string

  @ManyToOne(() => CustomerProduct, (customerProduct) => customerProduct.customerProductItems)
  @JoinColumn({ name: 'customer_product_id' })
  customerProduct: CustomerProduct;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, { cascade: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'quantity'})
  quantity: number;
}