import User from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  role: string;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}

export default Role;
