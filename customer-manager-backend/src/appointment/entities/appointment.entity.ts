import { BaseEntity } from "src/core/base/base.entity";
import Customer from "src/customers/entities/customer.entity";
import User from "src/users/entities/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Appoinment extends BaseEntity {
  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, { cascade: false })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({name: 'customer_group'})
  customerGroup: string
}