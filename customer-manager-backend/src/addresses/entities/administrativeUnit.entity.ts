import District from 'src/addresses/entities/district.entity';
import Province from 'src/addresses/entities/province.entity';
import Ward from 'src/addresses/entities/ward.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
class AdministrativeUnit {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'full_name_en' })
  fullNameEn: string;

  @Column({ name: 'short_name' })
  shortName: string;

  @Column({ name: 'short_name_en' })
  shortNameEn: string;

  @Column({ name: 'code_name' })
  codeName: string;

  @Column({ name: 'code_name_en' })
  codeNameEn: string;

  @OneToMany(() => Province, (province) => province.administrativeUnit)
  provinces: Province[];

  @OneToMany(() => District, (district) => district.administrativeUnit)
  districts: District[];

  @OneToMany(() => Ward, (ward) => ward.administrativeUnit)
  wards: Ward[];
}

export default AdministrativeUnit;
