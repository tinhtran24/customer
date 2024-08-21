import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import Customer from 'src/customers/entities/customer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {  paginate, Pagination } from "../core/paginate";
import { CustomerTranQueryDto } from "./dto/filter-customer.dto";
import { IPaginationOptions } from "../core/paginate/paginate.interface";

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async customerTranPaginateQuery(
      options: IPaginationOptions,
      queryOptions: CustomerTranQueryDto,
  ): Promise<Pagination<Customer>> {
    let { sortType } = queryOptions;
    if (['DESC', 'ASC'].indexOf(sortType) === -1) {
      sortType = 'DESC';
    }
    const queryBuilder = this.customersRepository.createQueryBuilder('customer')

    queryBuilder.orderBy('customer.createdAt', sortType)
    return await paginate<Customer>(queryBuilder, options);
  }

  async getAllCustomers() {
    return await this.customersRepository.find({
      relations: ['ward.district.province'],
    });
  }

  async getCustomerById(customerId: number) {
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
      const newCustomer = await this.customersRepository.create({
        fullName: createCustomerDto.fullName,
        street: createCustomerDto.street,
        contacts: createCustomerDto.contacts,
        wardCode: createCustomerDto.wardCode,
        totalOrder: createCustomerDto.totalOrder,
        gender: createCustomerDto.gender,
        status: createCustomerDto.status,
      });

      await this.customersRepository.insert(newCustomer);

      return newCustomer;
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  async updateCustomer(id: number, updateCustomerDto: UpdateCustomerDto) {
    try {
      const existedCustomer = await this.customersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (existedCustomer) {
        const updatedCustomer = await this.customersRepository.create({
          fullName: updateCustomerDto.fullName,
          street: updateCustomerDto.street,
          contacts: updateCustomerDto.contacts,
          wardCode: updateCustomerDto.wardCode,
          totalOrder: updateCustomerDto.totalOrder,
          gender: updateCustomerDto.gender,
          status: updateCustomerDto.status,
          callCountNumber: updateCustomerDto.callCountNumber,
          lastConnected: updateCustomerDto.lastConnected,
        });

        await this.customersRepository.update(
          existedCustomer.id,
          updateCustomerDto,
        );

        return updatedCustomer;
      }
    } catch (error) {
      throw new ServiceUnavailableException();
    }

    return null;
  }

  async deleteCustomer(id: number) {
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
