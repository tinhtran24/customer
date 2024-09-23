import { BaseEntity } from "src/core/base/base.entity";
import { Column, Entity, Unique} from "typeorm";

@Entity()
@Unique(['label', 'type'])
export class Setting extends BaseEntity {
  @Column({ name: 'label' })
  label: string;

  @Column({ name: 'key' })
  key: string;


  @Column({ name: 'type' })
  type: string;
}