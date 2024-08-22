import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
  Header,
  Query,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import Customer from 'src/customers/entities/customer.entity';
import {
  CUSTOMER_ALREADY_EXISTED,
  CUSTOMER_NOT_FOUND,
} from 'src/utils/messageConstants';
import * as Excel from 'exceljs';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/core/base/base.dto';
import { ApiGetAll } from 'src/core/base/base.swagger';
import { CustomersService } from './customers.service';
import { getPagingData } from 'src/core/pagination/paginate';

// @Public()
@Controller('customers')
@ApiTags('Customer API')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
  ) {}

  @Get('')
  @ApiGetAll('Get All', 'Customer')
  @ApiBearerAuth()
  async getAll(@Query() query: PaginationDto): Promise<any> {
      const [entities, count] = await this.customersService.getAllWithPagination(
          query,
          {},
          //@ts-ignore
          { createdAt: 'DESC' }
      );
      return {
        data: entities,
        meta: getPagingData(count, Number(query.page), Number(query.limit)),
    };
  }

  @Get(':id')
  @ApiBearerAuth()
  async getCustomerById(@Param('id') id: string): Promise<Customer> {
    const customer = await this.customersService.getCustomerById(id);

    if (!customer) {
      throw new NotFoundException(CUSTOMER_NOT_FOUND);
    }
    return customer;
  }

  @Post()
  @ApiBearerAuth()
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    const newCustomer =
      await this.customersService.createCustomer(createCustomerDto);

    if (!newCustomer) {
      throw new ConflictException(CUSTOMER_ALREADY_EXISTED);
    }

    return {
      message: 'Đã tạo khách hàng mới',
    };
  }

  @Patch(':id')
  @ApiBearerAuth()
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const updatedCustomer = await this.customersService.updateCustomer(
      id,
      updateCustomerDto,
    );

    if (!updatedCustomer) {
      throw new NotFoundException(CUSTOMER_NOT_FOUND);
    }
    return {
      message: 'Đã cập nhật thông tin khách hàng',
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  async deleteCustomer(@Param('id') id: string) {
    const deletedCustomer = await this.customersService.deleteCustomer(
      id,
    );

    if (!deletedCustomer) {
      throw new NotFoundException(CUSTOMER_NOT_FOUND);
    }

    return {
      message: 'Đã xóa khách hàng',
    };
  }

  @Get('/getexcel')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header(
    'Content-Disposition',
    'attachment; filename=' + 'Customer Export' + '.xlsx',
  )
  @ApiBearerAuth()
  async excel(@Res() response: Response) {
    try {
      const data = await this.customersService.getAllCustomers();
      const workbook = new Excel.Workbook();
      const columns = data.length <= 0 ? [] : Object.keys(data[0]);
      const dataRows = data.map((x) => Object.values(x));
      const border: Partial<Excel.Border> = {
        style: 'thin',
        color: { argb: 'FF000000' },
      };
      const worksheet = workbook.addWorksheet('customer data');
      const allBorder = {
        bottom: border,
        top: border,
        left: border,
        right: border,
      };
      let rowNo = 0;
      const currentRow: Excel.Row = worksheet.getRow(++rowNo);
      currentRow.height = 25;
      columns.forEach((col: string, index: number) => {
        const cell: Excel.Cell = currentRow.getCell(index + 1 + 1);
        cell.value = col;
        cell.font = { size: 16, bold: true };
        cell.border = allBorder;
        cell.alignment = { vertical: 'top' };
      });
      dataRows.forEach((data: string[]) => {
        const dataRow: Excel.Row = worksheet.getRow(++rowNo);
        dataRow.height = 25;
        data.forEach((cellData: string, index: number) => {
          const cell: Excel.Cell = dataRow.getCell(index + 1 + 1);
          cell.value = `${cellData}`.trim();
          cell.font = { size: 16 };
          cell.border = allBorder;
          cell.alignment = { vertical: 'top', horizontal: 'left' };
        });
      });
      worksheet.properties.defaultColWidth = 20;
      worksheet.getColumn(1).width = 3.5;
      worksheet.views = [{ showGridLines: false }];
      return workbook.xlsx.write(response).then(function () {
        response['status'](200).end();
      });
    } catch (ex) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
