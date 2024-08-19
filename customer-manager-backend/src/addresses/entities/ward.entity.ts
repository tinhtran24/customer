import AdministrativeUnit from 'src/addresses/entities/administrativeUnit.entity';
import District from 'src/addresses/entities/district.entity';
import Customer from 'src/customers/entities/customer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity()
class Ward {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column({ name: 'name_en' })
  nameEn: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'full_name_en' })
  fullNameEn: string;

  @Column({ name: 'code_name' })
  codeName: string;

  @ManyToOne(() => District, (district) => district.wards)
  @JoinColumn({ name: 'district_code' })
  district: District;

  @ManyToOne(
    () => AdministrativeUnit,
    (administrativeUnit) => administrativeUnit.wards,
  )
  @JoinColumn({ name: 'administrative_unit_id' })
  administrativeUnit: AdministrativeUnit;

  @OneToMany(() => Customer, (customer) => customer.ward)
  customers: Customer[];
}

export default Ward;
