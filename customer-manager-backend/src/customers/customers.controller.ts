import {
  Controller,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
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