import { Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Role from 'src/roles/roles.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/roles/role.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  // controllers: [UsersController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class RolesModule {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    const adminRoles = {
      id: 1,
      role: 'admin',
      description: 'Administrator',
    };

    const userRoles = {
      id: 2,
      role: 'user',
      description: 'Normal user',
    };

    const marketingRoles = {
      id: 3,
      role: 'marketing',
      description: 'Marketing user',
    };

    await this.roleRepository.save([adminRoles, userRoles, marketingRoles]);
  }
}
