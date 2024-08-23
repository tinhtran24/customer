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
import { ApiGetAll } from 'src/core/base/base.swagger';
import { CustomersService } from './customers.service';
import { getPagingData } from 'src/core/pagination/paginate';
import { BaseController } from 'src/core/base/base.controller';
import { QueryCustomertDto } from './dto/filter-customer.dto';
import { Crud } from 'src/core/decorator/crud.decorator';

@Crud({
  id: 'post',
  enabled: [
      { name: 'list', options: { allowGuest: false } },
      { name: 'detail', options: { allowGuest: false } },
      'store',
      'update',
      'delete',
      'restore',
      'deleteMulti',
      'restoreMulti',
  ],
  dtos: {
      query: QueryCustomertDto,
      create: CreateCustomerDto,
      update: UpdateCustomerDto,
  },
})
@Controller('customers')
@ApiTags('Customer API')
@ApiBearerAuth()
export class CustomersController extends BaseController<CustomersService> {
  constructor(protected customersService: CustomersService) {
      super(customersService);
  }
}