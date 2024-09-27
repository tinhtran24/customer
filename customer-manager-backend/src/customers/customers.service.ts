import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    ServiceUnavailableException,
    StreamableFile
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import Customer from 'src/customers/entities/customer.entity';
import { BaseService } from 'src/core/base/base.service';
import { CustomerRepository } from './customer.repository';
import { QueryHook } from 'src/core/type/query';
import { QueryCustomertDto } from './dto/filter-customer.dto';
import { Equal, Raw } from 'typeorm';
import { BetweenDates } from 'src/core/helper/filter-query.decorator.util';
import { PassThrough } from 'stream';
import { Column, Workbook } from 'exceljs';

interface ObjectType {
    [key: string]:any
}
@Injectable()
export class CustomersService extends BaseService<Customer, CustomerRepository> {
  constructor(protected customersRepository: CustomerRepository) {
    super(customersRepository);
  }

  protected enable_trash = true;
  protected enable_generate_code = true;
  protected code_prefix = 'KH';

  async export(columns: Partial<Column>[], data: Array<Record<string, any>>, filename: string) {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('customer');
      worksheet.columns = columns;
      worksheet.addRows(data);
      const stream = new PassThrough();
      await workbook.xlsx.write(stream);
      return new StreamableFile(stream, {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          disposition: 'attachment; filename=' + filename
      });
  }

  async findPaginate(
    options: QueryCustomertDto,
    where?: any,
  ){
    if (options.q && options.q !== '') {
      where['fullName'] = Raw(fullName => `${fullName} ILIKE '%${options.q}%' OR "Customer"."code" ILIKE '%${options.q}%' OR "Customer"."phone_number" ILIKE '%${options.q}%'`)
    }
    if (options.status) {
      where['status'] = Equal(options.status)
    }
    if (options.from && options.to) {
      where.createdAt = BetweenDates(options.from, options.to)
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

  async create(data: CreateCustomerDto): Promise<Customer> {
    try {
        if(data.phoneNumber && data.phoneNumber !== '') {
          const existPhoneNumber = await this.repository.findOneBy({phoneNumber : data.phoneNumber});
          if (existPhoneNumber) {
            throw new BadRequestException(`Không thể tạo khách hàng, trùng số điện thoại`);
          }
        }
        const customerCode = await this.generateCode();
        const dataReq = {
          ...data,
          code: customerCode
        }
        return this.repository.save(dataReq, { reload: true }) 
    } catch (e) {
      throw e;
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

  private readonly templateHeader = {
    columns: [
        {
            header: "Tên khách hàng",
            key: "fullName",
            width: 20,
            style: { font: { name: "Arial" } },
        },
        {
            header: "Điện thoại",
            key: "phoneNumber",
            width: 30,
            style: {
                font: { name: "Arial" },
            }
        },
        {
          header: "Mối quan hệ",
          key: "status",
          width: 20,
          style: { font: { name: "Arial" } },
        },
        {
            header: "Nhóm khách hàng",
            key: "group",
            width: 20,
            style: { font: { name: "Arial" } },
        },
        {
            header: "Nguồn khách hàng",
            key: "source",
            width: 20,
            style: { font: { name: "Arial" } },
        },
        {
          header: "Người phụ trách",
          key: "userInCharge",
          width: 20,
          style: { font: { name: "Arial" } },
        },
        {
          header: "Địa chỉ",
          key: "street",
          width: 20,
          style: { font: { name: "Arial" } },
        },
        {
          header: "Liên hệ lần cuối",
          key: "lastConnected",
          width: 20,
          style: { font: { name: "Arial" } },
        }
    ],
};

  private rowToJSON(row: any) {
    const headers = this.templateHeader.columns;
    let data = {};
    for (let i = 1; i < row.length; i++) {
        const field = headers[i - 1] ? headers[i - 1].key : undefined;
        if (!field) continue;
        data[field] =
            row[i] && row[i].result
                ? row[i].result.toFixed(0)
                : row[i] && row[i].text
                    ? row[i].text
                    : row[i]
                        ? row[i].toString()
                        : '';
    }
    return data;
}

  async transform(file: Express.Multer.File) {
    const imports = [];
    const workbook = new Workbook();
    await workbook.xlsx.load(file.buffer);
    const sheet = workbook.getWorksheet('Sheet1');
    sheet.eachRow((row, index) => {
        let values = row.values;
        if (index > 1) {
            const rowJson = this.rowToJSON(values);
            imports.push(rowJson);
        }
    });
    return imports
  }

  async customerStatus(where: any) {
    const qb = this.repository.createQueryBuilder('Customer')
    if(where.userInChargeId) {
      qb.where(`"Customer"."userInCharge" = ${where.userInChargeId}`)
    }
    qb.select(['"Customer"."status" as key' ,'COUNT("Customer"."status") as value']).groupBy(`"Customer"."status"`)
    const result = await qb.getRawMany();
    return {
        data: result
    }
  }
}
