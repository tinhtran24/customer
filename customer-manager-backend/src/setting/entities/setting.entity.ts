import { BaseEntity } from "src/core/base/base.entity";
import { Column, Entity} from "typeorm";

@Entity()
export class Setting extends BaseEntity {
  @Column({ name: 'label' })
  label: string;

  @Column({ name: 'key' })
  key: string;


  @Column({ name: 'type' })
  type: string;
}