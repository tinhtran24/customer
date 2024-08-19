import AdministrativeRegion from 'src/addresses/entities/administrativeRegion.entity';
import AdministrativeUnit from 'src/addresses/entities/administrativeUnit.entity';
import District from 'src/addresses/entities/district.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity()
class Province {
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

  @ManyToOne(
    () => AdministrativeRegion,
    (administrativeRegion) => administrativeRegion.provinces,
  )
  @JoinColumn({ name: 'administrative_region_id' })
  administrativeRegion: AdministrativeRegion;

  @ManyToOne(
    () => AdministrativeUnit,
    (administrativeUnit) => administrativeUnit.provinces,
  )
  @JoinColumn({ name: 'administrative_unit_id' })
  administrativeUnit: AdministrativeUnit;

  @OneToMany(() => District, (district) => district.province)
  districts: District[];
}

export default Province;
