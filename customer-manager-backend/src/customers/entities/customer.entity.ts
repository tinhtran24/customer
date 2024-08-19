import Ward from 'src/addresses/entities/ward.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type Contact = {
  name: string;
  phone: string;
};

export enum ENUM_STATUS_TYPE {
  NEW = 'Khách hàng mới',
  NOT_RECEIVE_CALL = 'Chưa nghe máy',
}
@Entity()
class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tax_code', nullable: true })
  taxCode: string;

  @Column({ nullable: true })
  urn: string;

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

  @Column({
    name: 'status',
    enum: ENUM_STATUS_TYPE,
    default: ENUM_STATUS_TYPE.NEW,
  })
  status: ENUM_STATUS_TYPE;

  @Column({ name: 'call_count_number' , nullable: true })
  callCountNumber: number;

  @Column({ name: 'total_order' })
  totalOrder: number;

  @Column({ name: 'last_connected', nullable: true })
  lastConnected: Date;

  @ManyToOne(() => Ward, (ward) => ward.customers)
  @JoinColumn({ name: 'ward_code' })
  ward: Ward;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

export default Customer;
