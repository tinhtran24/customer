import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/core/base/base.controller";
import { TaskService } from "./task.service";
import { Crud } from "src/core/decorator/crud.decorator";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto, UpdateTaskStatusDto } from "./dto/update-task.dto";
import { PaginateDto } from "src/core/base/base.dto";
import { QueryTaskDto } from "./dto/filter.dto";
import { Roles } from "../roles/roles.decorator";
import { RoleEnum } from "../roles/role.enum";
import { UpdateCustomerProductBulkDto } from "../customer-product/dto/update-customer-order-status.dto";

@Crud({
    id: 'task',
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
        query: QueryTaskDto,
        create: CreateTaskDto,
        update: UpdateTaskDto,
    },
})
@Controller('task')
@ApiTags('Task API')
@ApiBearerAuth()
export class TaskController  extends BaseController<TaskService> {
    constructor(protected taskService: TaskService) {
        super(taskService);
    }

    @Get('customer/:id')
    async getByCustomerId(
        @Param('id', new ParseUUIDPipe())
        item: string,
        @Query() options: PaginateDto,
        @Request() req
    ) {
        return this.taskService.getByCustomerId(item, options, req.user);
    }

    @Get('')
    async listPaging(
        @Query() options: QueryTaskDto,
        @Request() req
    ) {
        let where = {}
        if (req.user['role'] !== 'admin') {
            where['userInChargeId'] = req.user['userId']
        }
        return this.taskService.find(options, where);
    }

    @Patch('/:id/status')
    @ApiBody({ type: UpdateTaskStatusDto })
    async updateStatus(
        @Param('id', new ParseUUIDPipe())
            item: string,
        @Body()
            data: any,
        ...args: any[]
    ) {
        return this.taskService.updateStatus(item, data)
    }

    @Patch('status')
    @Roles(RoleEnum.Admin)
    @ApiBody({ type: UpdateCustomerProductBulkDto })
    async bulkUpdateUserInCharge(
        @Body()
            data: any,
        ...args: any[]
    ) {
        return this.taskService.updateBulk(data)
    }
}