import AdministrativeUnit from 'src/addresses/entities/administrativeUnit.entity';
import Province from 'src/addresses/entities/province.entity';
import Ward from 'src/addresses/entities/ward.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity()
class District {
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

  @ManyToOne(() => Province, (province) => province.districts)
  @JoinColumn({ name: 'province_code' })
  province: Province;

  @ManyToOne(
    () => AdministrativeUnit,
    (administrativeUnit) => administrativeUnit.districts,
  )
  @JoinColumn({ name: 'administrative_unit_id' })
  administrativeUnit: AdministrativeUnit;

  @OneToMany(() => Ward, (ward) => ward.district)
  wards: Ward[];
}

export default District;
