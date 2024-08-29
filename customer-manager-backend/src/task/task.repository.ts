import { CustomRepository } from "src/core/decorator/repository.decorator";
import { Task } from "./entities/task.entity";
import { OrderType } from "src/core/type/query";
import { BaseRepository } from "src/core/base/base.repository";

@CustomRepository(Task)
export class TaskRepository extends BaseRepository<Task> {
    protected qbName = 'task';

    protected orderBy = { name: 'createdAt', order: OrderType.ASC };

    protected relations = ['appoinment', 'userInCharge'];

}