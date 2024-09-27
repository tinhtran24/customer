import { BaseController } from "../core/base/base.controller";
import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CustomerProductService } from "./customer-product.service";
import { Crud } from "src/core/decorator/crud.decorator";
import { CreateCustomerProductDto, UpdateCustomerProductDto } from "./dto/create-customer-product.dto";
import { ListQueryDto, PaginateDto } from "src/core/base/base.dto";
import { CreateCustomerOrderDto, UpdateCustomerOrderDto } from "./dto/create-customer-order.dto";
import { QueryChartCustomerProductDto, QueryCustomerProductDto } from "./dto/customer-product-filter.dto";
import { Roles } from "src/roles/roles.decorator";
import { RoleEnum } from "src/roles/role.enum";
import e from "express";

@Crud({
    id: 'customer-product',
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
        query: ListQueryDto,
        create: CreateCustomerProductDto,
        update: UpdateCustomerProductDto,
    },
})
@Controller('customer-product')
@ApiTags('Customer product API')
@ApiBearerAuth()
export class CustomerProductController extends BaseController<CustomerProductService> {
    constructor(protected customerProductService: CustomerProductService) {
        super(customerProductService);
    }

    @Get('dashboard')
    async dashboard(
        @Query() options: QueryCustomerProductDto,
        @Request() req
    ) {
        if (req.user['role'] !== 'admin') {
          options.userId = req.user['userId']
        }
        return this.customerProductService.dashboard(options);
    }

    @Get('chart')
    async chart(
        @Query() options: QueryChartCustomerProductDto,
        @Request() req
    ) {
        if (req.user['role'] !== 'admin') {
            options.userId = req.user['userId']
        }
        return this.customerProductService.chart(options);
    }


    @Get('customer/:id')
    async getByCustomerId(
        @Param('id', new ParseUUIDPipe())
        item: string,
        @Query() options: PaginateDto
    ) {
        return this.customerProductService.getByCustomerId(item, options);
    }

    @Post('order')
    @ApiBody({ type: CreateCustomerOrderDto })
    async createOrder(
        @Body()
        data: any,
        ...args: any[]
    ) {
        try {
            return await this.customerProductService.createOrder(data);
        } catch (e) {
            throw e
        }
    }

    @Patch('order/:id')
    @Roles(RoleEnum.Admin)
    @ApiBody({ type: UpdateCustomerOrderDto })
    async updateOrder(
        @Param('id', new ParseUUIDPipe())
        item: string,
        @Body()
        data: any,
        ...args: any[]
    ) {
        try {
            return await this.customerProductService.updateOrder(item, data);
        } catch (e) {
            throw e
        }
    }

    @Get('export')
    async export(
        @Query() options: QueryCustomerProductDto,
        @Request() req
    ) {
        let where = {}
        if (req.user['role'] !== 'admin') {
            options.userId = req.user['userId']
        }
        options.limit = 9999
        const data = await this.customerProductService.dashboard(options);
        const columns = [
            { header: 'ID', key: 'id', width: 20 },
            { header: 'Mã ĐH', key: 'code', width: 30 },
            { header: 'Tên KH', key: 'customerFullname', width: 30 },
            { header: 'Giá', key: 'price', width: 30 },
            { header: 'PT giao hàng', key: 'shipMethod', width: 30 },
            { header: 'PT thanh toán', key: 'paymentMethod', width: 60},
            { header: 'Người tạo', key: 'createdUserName', width: 30},
            { header: 'Ngày tạo', key: 'createdAt', width: 30}
        ]
        const res = data.data.map(e => {
           return {
            ...e,
            price: e.price.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND',
            }),
            customerFullname: e.customer?.fullName,
            createdUserName: e.createdUser?.name,
           }
        })
        return this.customerProductService.export(columns, res, 'donhang.xlsx')
    }
}