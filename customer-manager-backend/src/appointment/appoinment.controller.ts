import { Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/core/base/base.controller";
import { AppoinmentService } from "./appoinment.service";
import { CreateScheduleDto } from "./dto/create-appoinment.dto";
import { UpdateScheduleDto } from "./dto/update-appoinment.dto";
import { Crud } from "src/core/decorator/crud.decorator";
import { ListQueryDto } from "src/core/base/base.dto";

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
    constructor(protected appoinmentService: AppoinmentService) {
        super(appoinmentService);
    }
}