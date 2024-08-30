import { Task } from "./entities/task.entity";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base.service";
import { TaskRepository } from "./task.repository";
import { PaginateDto } from "src/core/base/base.dto";

@Injectable()
export class TaskService extends BaseService<Task, TaskRepository> {
    constructor(protected taskRepository: TaskRepository) {
        super(taskRepository);
      }
    
      protected enable_trash = true;

      async getByCustomerId(customerId: string, options: PaginateDto) {
        return this.repository.findPaginate(options, {
          appoinment: {
            customerId
          }
        });
      }
}