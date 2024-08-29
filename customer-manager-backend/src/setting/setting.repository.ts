import { CustomRepository } from "src/core/decorator/repository.decorator";
import { Setting } from "./entities/setting.entity";
import { OrderType } from "src/core/type/query";
import { BaseRepository } from "src/core/base/base.repository";

@CustomRepository(Setting)
export class SettingRepository extends BaseRepository<Setting> {
    protected qbName = 'task';

    protected orderBy = { name: 'createdAt', order: OrderType.ASC };

}