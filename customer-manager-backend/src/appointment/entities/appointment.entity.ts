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

  @Index()
  @Column({ name: 'user_in_charge' })
  userInChargeId: string;

  @ManyToOne(() => User, { cascade: false })
  @JoinColumn({ name: 'user_in_charge' })
  userInCharge: User;

  @Column({name: 'customer_group'})
  customerGroup: string
}