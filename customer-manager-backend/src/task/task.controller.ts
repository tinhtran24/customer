import { Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/core/base/base.controller";
import { TaskService } from "./task.service";
import { Crud } from "src/core/decorator/crud.decorator";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

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
}