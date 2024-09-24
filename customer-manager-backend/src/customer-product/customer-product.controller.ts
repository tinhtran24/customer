import { BaseController } from "../core/base/base.controller";
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CustomerProductService } from "./customer-product.service";
import { Crud } from "src/core/decorator/crud.decorator";
import { CreateCustomerProductDto, UpdateCustomerProductDto } from "./dto/create-customer-product.dto";
import { ListQueryDto, PaginateDto } from "src/core/base/base.dto";
import { CreateCustomerOrderDto, UpdateCustomerOrderDto } from "./dto/create-customer-order.dto";
import { QueryChartCustomerProductDto, QueryCustomerProductDto } from "./dto/customer-product-filter.dto";
import { Roles } from "src/roles/roles.decorator";
import { RoleEnum } from "src/roles/role.enum";

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

    @Put('order')
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
}