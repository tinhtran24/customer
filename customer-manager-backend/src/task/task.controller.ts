import { Controller, Get, Param, ParseUUIDPipe, Query, Request} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/core/base/base.controller";
import { TaskService } from "./task.service";
import { Crud } from "src/core/decorator/crud.decorator";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginateDto } from "src/core/base/base.dto";
import { QueryTaskDto } from "./dto/filter.dto";

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
}