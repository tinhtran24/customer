import { BaseEntity } from "src/core/base/base.entity";
import Customer from "src/customers/entities/customer.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('note')
export class Note extends BaseEntity {
  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, { cascade: false })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'description' })
  description: string
}