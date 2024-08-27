import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/core/base/base.controller";
import { AppoinmentService } from "./appoinment.service";
import { CreateScheduleDto } from "./dto/create-appoinment.dto";
import { UpdateScheduleDto } from "./dto/update-appoinment.dto";
import { Crud } from "src/core/decorator/crud.decorator";
import { ListQueryDto, PaginateDto } from "src/core/base/base.dto";
import { CreateAppointmentIncludeTasks } from "./dto/create-appoinment-task.dto";
import { TaskService } from "src/task/task.service";
import e from "express";

@Crud({
    id: 'appoinment',
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
        create: CreateScheduleDto,
        update: UpdateScheduleDto,
    },
})
@Controller('appoinment')
@ApiTags('Appoinment API')
@ApiBearerAuth()
export class AppoinmentController  extends BaseController<AppoinmentService> {
    constructor(
        protected appoinmentService: AppoinmentService,
        protected taskService: TaskService,
        
    ) {
        super(appoinmentService);
    }

    @Get('customer/:id')
    async getByCustomerId(
        @Param('id', new ParseUUIDPipe())
        item: string,
        @Query() options: PaginateDto
    ) {
        return this.appoinmentService.getByCustomerId(item, options);
    }

    @Post('task')
    @ApiBody({ type: CreateAppointmentIncludeTasks })
    async createAppointTask(
        @Body()
        data: any,
        ...args: any[]
    ) {
        try {
            console.log(data.createScheduleDto);
            const appointment = await this.appoinmentService.create(data.createScheduleDto);
            for (const reqTask of data.createTaskDto) {
                reqTask.appoinmentId = appointment.id 
                await this.taskService.create(reqTask)
            }
            return appointment
        } catch (e) {
            throw e
        }
    }
}