import { BaseController } from "../core/base/base.controller";
import {
    Body,
    Controller, Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    Request
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CustomerProductService } from "./customer-product.service";
import { Crud } from "src/core/decorator/crud.decorator";
import { CreateCustomerProductDto, UpdateCustomerProductDto } from "./dto/create-customer-product.dto";
import { ListQueryDto, PaginateDto } from "src/core/base/base.dto";
import { CreateCustomerOrderDto, UpdateCustomerOrderDto } from "./dto/create-customer-order.dto";
import { QueryChartCustomerProductDto, QueryCustomerProductDto } from "./dto/customer-product-filter.dto";
import { Roles } from "src/roles/roles.decorator";
import { RoleEnum } from "src/roles/role.enum";
import { UpdateCustomerProductBulkDto } from "./dto/update-customer-order-status.dto";

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

    @Delete('order/:id')
    async deleteOrder(
        @Param('id', new ParseUUIDPipe())
            item: string,
        @Request() req
    ) {
        try {
            const userId = req.user['userId']
            return await this.customerProductService.deleteOrder(item, userId);
        } catch (e) {
            throw e
        }
    }

    @Patch('status')
    @Roles(RoleEnum.Admin)
    @ApiBody({ type: UpdateCustomerProductBulkDto })
    async bulkUpdateUserInCharge(
        @Request() req,
        @Body()
            data: any,
        ...args: any[]
    ) {
        const userId = req.user['userId']
        return this.customerProductService.updateBulk(data, userId)
    }

    @Get('export')
    async export(
        @Query() options: QueryCustomerProductDto,
        @Request() req
    ) {
        if (req.user['role'] !== 'admin') {
            options.userId = req.user['userId']
        }
        options.limit = 9999
        options.page = 1
        const data = await this.customerProductService.dashboard(options);
        const columns = [
            { header: 'Ngày đặt hàng', key: 'ngayMua', width: 30},
            { header: 'Ngày tạo', key: 'createdAt', width: 30},
            { header: 'Mã ĐH', key: 'code', width: 30 },
            { header: 'Người thực hiện', key: 'nguoiThucHien', width: 30},
            { header: 'Mã KH', key: 'customerCode', width: 30 },
            { header: 'Tên KH', key: 'customerFullname', width: 30 },
            { header: 'Trạng thái KH', key: 'customerStatus', width: 30 },
            { header: 'Số ĐT', key: 'customerPhoneNumber', width: 30 },
            { header: 'Email', key: 'customerEmail', width: 30 },
            { header: 'Người liên hệ', key: 'lhFullname', width: 30 },
            { header: 'Điện thoại người liên hệ', key: 'lhPhoneNumber', width: 30 },
            { header: 'Địa chỉ giao hàng', key: 'street', width: 60 },
            { header: 'Phương thức giao hàng', key: 'shipMethod', width: 30},
            { header: 'Nguồn khách hàng', key: 'customerSource', width: 30 },
            { header: 'Mã SP', key: 'productCode', width: 30 },
            { header: 'Tên sản phẩm', key: 'productName', width: 30 },
            { header: 'Mô tả', key: 'productNameDescription', width: 30 },
            { header: 'Số lượng', key: 'quantity', width: 30 },
            { header: 'Giá vốn', key: 'giaVon', width: 30, style : { numFmt : '#,##0.00' } },
            { header: 'Giá bán', key: 'unitPrice', width: 30, style : { numFmt : '#,##0.00' } },
            { header: 'Thành tiền', key: 'thanhtien', width: 30, style : { numFmt : '#,##0.00' } },
            { header: 'Doanh số', key: 'doanhso', width: 30, style : { numFmt : '#,##0.00' } },
            { header: 'Doanh thu sau CK', key: 'sauck', width: 30, style : { numFmt : '#,##0.00' } },
            { header: 'Doanh thu trước thuế', key: 'truocthue', width: 30, style : { numFmt : '#,##0.00' } },
            { header: 'Doanh thu', key: 'doanhthu', width: 30, style : { numFmt : '#,##0.00' } },
            { header: 'Lợi nhuận', key: 'price', width: 30, style : { numFmt : '#,##0.00' } },
            { header: 'Hình thức thanh toán', key: 'paymentMethod', width: 30},
            { header: 'Người tạo', key: 'createdUserName', width: 30 },
            { header: 'Trạng thái', key: 'status', width: 30 },
            { header: 'Kho hàng', key: 'source', width: 30 },
        ]
        let res:any[] = []
        for (const item of data.data) {
            res.push(
                {
                    ...item,
                    ...item.customerProductItems[0],
                    price: item.price,
                    ngayMua: item.createdAt.toLocaleDateString(),
                    createdAt: item.createdAt.toLocaleDateString(),
                    nguoiThucHien: item.createdUser?.name,
                    customerFullname: item.customer?.fullName,
                    customerStatus:  item.customer?.status,
                    lhFullname: item.customer?.fullName,
                    customerEmail:'',
                    customerPhoneNumber: item.customer?.phoneNumber,
                    lhPhoneNumber: item.customer?.phoneNumber,
                    customerCode:  item.customer?.code,
                    customerSource: item.customer?.source,
                    createdUserName: item.createdUser?.name,
                    productCode: item.customerProductItems[0].product.code,
                    productName: item.customerProductItems[0].product.title,
                    productNameDescription: item.customerProductItems[0].product.description,
                    zero: '',
                    giaVon: item.customerProductItems[0].unitPrice,
                    thanhtien: item.price,
                    loinhuan: item.price,
                    doanhso: item.price,
                    doanhthu:item.price,
                    truocthue: item.price,
                    conlai: item.price,
                    sauck: item.price,
                    unitPrice: item.customerProductItems[0].unitPrice
                }
            )
            if(item.customerProductItems.length > 1) {
                item.customerProductItems.shift()
                for(const productItem of item.customerProductItems) {
                    res.push(
                        {
                            ...productItem,
                            productCode: productItem.product.code,
                            productName: productItem.product.title,
                            productNameDescription: productItem.product.description,
                            status: '',
                            zero: '',
                            giaVon: productItem.unitPrice,
                            unitPrice: productItem.unitPrice,
                            ngayMua: item.createdAt.toLocaleDateString(),
                            createdAt: item.createdAt.toLocaleDateString()
                        }
                    )
                }
            }
        }
        console.log(res.length)
        return this.customerProductService.export(columns, res, 'donhang.xlsx')
    }
}