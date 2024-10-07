import { Task } from "./entities/task.entity";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base.service";
import { TaskRepository } from "./task.repository";
import { PaginateDto } from "src/core/base/base.dto";
import { BetweenDates } from "src/core/helper/filter-query.decorator.util";
import { QueryTaskDto } from "./dto/filter.dto";

@Injectable()
export class TaskService extends BaseService<Task, TaskRepository> {
    constructor(protected taskRepository: TaskRepository) {
        super(taskRepository);
    }

    protected enable_trash = true;
    protected enable_generate_code = true;
    protected code_prefix = 'CV';

    async getByCustomerId(customerId: string, options: PaginateDto, user: any) {
        let where = {
            appoinment: {
                customerId
            }
        }
        if (user['role'] !== 'admin') {
            where['userInChargeId'] = user['userId']
        }
        return this.repository.findPaginate(options, where);
    }

    async find(options: QueryTaskDto, where) {
        if (options.from && options.to) {
            where.date = BetweenDates(options.from, options.to)
        }
        return this.findPaginate(options, where);
    }
}