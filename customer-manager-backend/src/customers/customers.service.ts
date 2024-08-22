import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import Customer from 'src/customers/entities/customer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/core/base/base.dto';

@Injectable()
export class CustomersService {
  getAllWithPagination(query: PaginationDto, arg1: {}, arg2: { createdAt: string; }, arg3: string[]): Promise<[Customer[], number]> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}
  
  async getAllCustomers() {
    return await this.customersRepository.find({
      relations: ['ward.district.province'],
    });
  }

  async getCustomerById(customerId: string) {
    try {
      return await this.customersRepository.findOne({
        where: {
          id: customerId,
        },
        relations: ['ward.district.province'],
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
