import { CustomRepository } from "src/core/decorator/repository.decorator";
import { Appoinment } from "./entities/appointment.entity";
import { OrderType } from "src/core/type/query";
import { BaseRepository } from "src/core/base/base.repository";

@CustomRepository(Appoinment)
export class AppoinmentRepository extends BaseRepository<Appoinment> {
    protected qbName = 'Appoinment';

    protected orderBy = { name: 'updatedAt', order: OrderType.ASC };
}