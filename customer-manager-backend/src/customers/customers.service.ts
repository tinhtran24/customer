import { ForbiddenException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import Customer from 'src/customers/entities/customer.entity';
import { BaseService } from 'src/core/base/base.service';
import { CustomerRepository } from './customer.repository';
import { QueryHook } from 'src/core/type/query';
import { QueryCustomertDto } from './dto/filter-customer.dto';
import { Equal, Raw } from 'typeorm';

@Injectable()
export class CustomersService extends BaseService<Customer, CustomerRepository> {
  constructor(protected customersRepository: CustomerRepository) {
    super(customersRepository);
  }

  protected enable_trash = true;
  protected enable_generate_code = true;
  protected code_prefix = 'KH';

  async findPaginate(
    options: QueryCustomertDto,
    where?: any,
  ){
    if (options.q !== '') {
      where['fullName'] = Raw(fullName => `${fullName} ILIKE '%${options.q}%' OR "Customer"."code" ILIKE '%${options.q}%' OR "Customer"."phone_number" ILIKE '%${options.q}%'`)
    }
    if (options.status) {
      where['status'] = Equal(options.status)
    }
    return this.repository.findPaginate(options, where);
  }

  async detail(customerId: string, trashed?: boolean, callback?: QueryHook<Customer>): Promise<Customer> {
    try {
      return await this.customersRepository.findOne({
        where: {
          id: customerId,
        },
        relations: ['ward.district.province', 'userInCharge'],
      });
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    try {
      const newCustomer = await this.customersRepository.create(createCustomerDto);

      await this.customersRepository.insert(newCustomer);

      return newCustomer;
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  async updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      const existedCustomer = await this.customersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (existedCustomer) {
        return await this.customersRepository.update(
            existedCustomer.id,
            updateCustomerDto,
        );
      } else {
        return await this.customersRepository.create(updateCustomerDto)
      }
    } catch (error) {
      throw new ServiceUnavailableException();
    }

    return null;
  }

  async deleteCustomer(id: string) {
    try {
      const existedCustomer = await this.customersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!existedCustomer) {
        return null;
      }

      const deletingCustomer = { ...existedCustomer };

      await this.customersRepository.softRemove(existedCustomer);
      return deletingCustomer;
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }
}
