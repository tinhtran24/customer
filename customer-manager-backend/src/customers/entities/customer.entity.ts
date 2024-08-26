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

export enum ENUM_STATUS_TYPE {
  NEW_CUSTOMERS = 'KH mới',
  NOT_RECEIVE_CALL = 'KH Chưa nghe máy',
  POTENTIAL_CUSTOMERS = 'KH tiềm năng',
  NON_EXIGENCY_CUSTOMERS = 'KH không có nhu cầu',
  OLD_PATIENT = 'BN Cũ',
  NEW_PATIENT = 'BN Mới',
  CANCEL_PATIENT = 'BN Bỏ',
  RE_TREATMENT_PATIENT = 'BN Điều trị lại'
}
@Entity()
class Customer extends BaseEntity {
  @Column({ name: 'code' })
  code: string;

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
    type: 'enum',
    enum: ENUM_STATUS_TYPE,
    default: ENUM_STATUS_TYPE.NEW_CUSTOMERS,
  })
  status: ENUM_STATUS_TYPE;

  @Column({ name: 'call_count_number' , nullable: true })
  callCountNumber: number;

  @Column({ name: 'group' , nullable: true })
  group: string;

  @Column({ name: 'source' , nullable: true })
  source: string;

  @Column({ name: 'total_order' })
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
