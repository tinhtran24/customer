import { Controller, Get, Param, ParseUUIDPipe, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/core/base/base.controller";
import { Crud } from "src/core/decorator/crud.decorator";
import { SettingService } from "./setting.service";
import { CreateOrUpdateSettingDto } from "./dto/create-setting.dto";

@Crud({
    id: 'setting',
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
        create: CreateOrUpdateSettingDto,
        update: CreateOrUpdateSettingDto,
    },
})
@Controller('setting')
@ApiTags('Setting API')
@ApiBearerAuth()
export class SettingController  extends BaseController<SettingService> {
    constructor(protected settingService:SettingService) {
        super(settingService);
    }
}