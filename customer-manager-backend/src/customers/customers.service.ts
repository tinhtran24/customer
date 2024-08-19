import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import Customer from 'src/customers/entities/customer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async getAllCustomers() {
    const customers = await this.customersRepository.find({
      relations: ['ward.district.province'],
    });
    return customers;
  }

  async getCustomerById(customerId: number) {
    try {
      const customers = await this.customersRepository.findOne({
        where: {
          id: customerId,
        },
        relations: ['ward.district.province'],
      });

      return customers;
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    try {
      const newCustomer = await this.customersRepository.create({
        taxCode: createCustomerDto.taxCode,
        urn: createCustomerDto.urn,
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
          taxCode: updateCustomerDto.taxCode,
          urn: updateCustomerDto.urn,
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
