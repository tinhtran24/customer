import Ward from 'src/addresses/entities/ward.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import User from "../../users/entities/user.entity";
import { BaseEntity } from "../../core/base/base.entity";

export type Contact = {
  name: string;
  phone: string;
};


@Entity()
class Customer extends BaseEntity {
  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'gender' })
  gender: string;

  @Column({ nullable: true })
  street: string;

  @Column({ type: 'jsonb', nullable: true })
  contacts: Contact[];

  @Column({ name: 'ward_code' })
  wardCode: string;

  @Column({ name: 'user_in_charge' })
  userInChargeId: string;

  @Column({
    name: 'status',
  })
  status: string;

  @Column({ name: 'call_count_number' , nullable: true })
  callCountNumber: number;

  @Column({ name: 'group' , nullable: true })
  group: string;

  @Column({ name: 'source' , nullable: true })
  source: string;

  @Column({ name: 'total_order' , nullable: true })
  totalOrder: number;

  @Column({ name: 'last_connected', nullable: true })
  lastConnected: Date;

  @ManyToOne(() => Ward, (ward) => ward.customers)
  @JoinColumn({ name: 'ward_code' })
  ward: Ward;

  @ManyToOne(() => User, (user) => user.customers)
  @JoinColumn({ name: 'user_in_charge'})
  userInCharge: User
}

export default Customer;
