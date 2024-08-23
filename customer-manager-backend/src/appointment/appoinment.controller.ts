import { Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/core/base/base.controller";
import { AppoinmentService } from "./appoinment.service";

@Controller('Appoinment')
@ApiTags('Appoinment API')
@ApiBearerAuth()
export class AppoinmentController  extends BaseController<AppoinmentService> {
    constructor(protected appoinmentService: AppoinmentService) {
        super(appoinmentService);
    }
}