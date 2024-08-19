import Province from 'src/addresses/entities/province.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
class AdministrativeRegion {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'name_en' })
  nameEn: string;

  @Column({ name: 'code_name' })
  codeName: string;

  @Column({ name: 'code_name_en' })
  codeNameEn: string;

  @OneToMany(() => Province, (province) => province.administrativeRegion)
  provinces: Province[];
}

export default AdministrativeRegion;
