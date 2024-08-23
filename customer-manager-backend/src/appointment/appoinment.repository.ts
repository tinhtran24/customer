import { CustomRepository } from "src/core/decorator/repository.decorator";
import { Appoinment } from "./entities/appointment.entity";
import { OrderType } from "src/core/type/query";
import { BaseTreeRepository } from "src/core/base/base.tree.repository";

@CustomRepository(Appoinment)
export class AppoinmentRepository extends BaseTreeRepository<Appoinment> {
    protected qbName = 'Appoinment';

    protected orderBy = { name: 'updatedAt', order: OrderType.ASC };
}