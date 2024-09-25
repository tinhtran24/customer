import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { BaseController } from 'src/core/base/base.controller';
import { QueryCustomertDto } from './dto/filter-customer.dto';
import { Crud } from 'src/core/decorator/crud.decorator';
import { UsersService } from 'src/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportCustomerDto } from './dto/import-cusomter.dto';
import { parse, toDate } from 'date-fns';

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
  constructor(
    protected customersService: CustomersService,
    protected userService: UsersService
  ) {
      super(customersService);
  }

  @Get('')
  async listPaging(
      @Query() options: QueryCustomertDto,
      @Request() req
  ) {
      let where = {}
      if (!['admin', 'marketing'].includes(req.user['role'])){
        where['userInChargeId'] = req.user['userId']
      }
      return this.customersService.findPaginate(options, where);
  }

  @Get('status')
  async listCustomerStatus() {
      return this.customersService.customerStatus();
  }
  
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        comment: { type: 'string' },
        outletId: { type: 'integer' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const isExcel = ['xlsx', 'xls'].includes(file.originalname.split('.').pop());
    if (!isExcel) throw new BadRequestException('Invalid Excel file');
    const importData = await this.customersService.transform(file) as ImportCustomerDto[];
    for (const item of importData ){
      let user = await this.userService.getUserByName(item.userInCharge)
      if(!user) {
        user = await this.userService.getUserByName('Admin')
      }
      const data: CreateCustomerDto = {
        ...item,
        street: item.street || '',
        userInChargeId: user.id,
        note: null,
        wardCode: null,
        gender: null,
        lastConnected: parse(item.lastConnected, 'dd/MM/yyyy HH:mm', new Date())
      }
      await this.customersService.create(data)
    }
  }

    @Get('export')
    async export(
        @Query() options: QueryCustomertDto,
        @Request() req
    ) {
        let where = {}
        if (!['admin', 'marketing'].includes(req.user['role'])){
            where['userInChargeId'] = req.user['userId']
        }
        options.limit = 9999
        const data = await this.customersService.findPaginate(options, where);
        const columns = [
            { header: 'ID', key: 'id', width: 20 },
            { header: 'Mã KH', key: 'code', width: 30 },
            { header: 'Tên KH', key: 'fullName', width: 30 },
            { header: 'Giới tính', key: 'gender', width: 30 },
            { header: 'Điện thoại', key: 'phoneNumber', width: 30 },
            { header: 'Địa chỉ', key: 'street', width: 60},
            { header: 'Trạng thái', key: 'status', width: 30},
            { header: 'Nhóm KH', key: 'group', width: 30},
            { header: 'Nguồn KH', key: 'source', width: 30},
            { header: 'Người phụ trách', key: 'userInCharge.name', width: 30},
            { header: 'Ngày tạo', key: 'createdAt', width: 30},
            { header: 'Ngày cập nhật', key: 'updatedAt', width: 30},
        ]
        const res = data.items
        return this.customersService.export(columns, res, 'customer.xlsx')
    }
}