import { forwardRef, Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import Customer from 'src/customers/entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from './customer.repository';
import { DatabaseModule } from 'src/database/database.module';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import User from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    DatabaseModule.forRepository([CustomerRepository]),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UsersModule)
  ],
  controllers: [CustomersController],
  providers: [CustomersService, UsersService],
})
export class CustomersModule {}
