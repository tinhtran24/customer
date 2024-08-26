import {
    Entity,
    Column,
    JoinColumn,
    Index,
    ManyToOne,
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

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, { cascade: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'price' })
  price: number;

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