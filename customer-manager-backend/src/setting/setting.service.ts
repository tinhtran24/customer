import { Setting } from "./entities/setting.entity";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base.service";
import { SettingRepository } from "./setting.repository";

@Injectable()
export class SettingService extends BaseService<Setting, SettingRepository> {
    constructor(protected settingRepository: SettingRepository) {
        super(settingRepository);
      }
    
      protected enable_trash = true;
}