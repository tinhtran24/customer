import { Setting } from "./entities/setting.entity";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base.service";
import { SettingRepository } from "./setting.repository";
import { PaginateDto } from "src/core/base/base.dto";

@Injectable()
export class SettingService extends BaseService<Setting, SettingRepository> {
    constructor(protected settingRepository: SettingRepository) {
        super(settingRepository);
      }
    
      protected enable_trash = true;

      async getByType(type: string, options: PaginateDto) {
        return this.repository.findPaginate(options, {
            type
        });
      }
}