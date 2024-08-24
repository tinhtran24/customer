import { Task } from "./entities/task.entity";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base.service";
import { TaskRepository } from "./task.repository";

@Injectable()
export class TaskService extends BaseService<Task, TaskRepository> {
    constructor(protected taskRepository: TaskRepository) {
        super(taskRepository);
      }
    
      protected enable_trash = true;
}