import { Appoinment } from "src/appointment/entities/appointment.entity";
import { BaseEntity } from "src/core/base/base.entity";
import User from "src/users/entities/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Task extends BaseEntity {
  @Column({ name: 'appoinment_id' })
  appoinmentId: string;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'label' })
  label: string;

  @Column({ name: 'description' })
  description: string;

  @ManyToOne(() => Appoinment, { cascade: false })
  @JoinColumn({ name: 'appoinment_id' })
  appoinment: Appoinment;

  @Column({ name: 'date', nullable: true })
  date: Date

  @Index()
  @Column({ name: 'user_in_charge' })
  userInChargeId: string;

  @ManyToOne(() => User, { cascade: false })
  @JoinColumn({ name: 'user_in_charge' })
  userInCharge: User;
}