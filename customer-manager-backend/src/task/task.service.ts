import { Task } from "./entities/task.entity";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base.service";
import { TaskRepository } from "./task.repository";
import { PaginateDto } from "src/core/base/base.dto";
import { BetweenDates } from "src/core/helper/filter-query.decorator.util";
import { QueryTaskDto } from "./dto/filter.dto";
import { In, ILike } from "typeorm";
import { DateUtil } from "../utils/date";
import { UpdateCustomerProductBulkDto } from "../customer-product/dto/update-customer-order-status.dto";
import { CustomerProduct } from "../customer-product/entities/product-customer.entity";
import { UpdateTaskDto, UpdateTaskStatusDto } from "./dto/update-task.dto";

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
            },
            date: BetweenDates(new Date())
        }
        if (user['role'] !== 'admin') {
            where['userInChargeId'] = user['userId']
        }
        return this.repository.findPaginate(options, where);
    }

    async find(options: QueryTaskDto, where) {
        if (options.from && options.to) {
            where.date = BetweenDates(options.from, options.to)
        } else {
            where.date = BetweenDates(new Date())
        }
        if (options.status) {
            where.status = ILike(`%${options.status}%`)
        }
        return this.findPaginateWithOutDis(options, where)
    }

    async findPaginateWithOutDis(
        options: QueryTaskDto,
        where?: any
    ): Promise<any> {
        const page = Number(options?.page || 1) || 1;
        const perPage = Number(options?.limit || 10) || 10;
        const skip = page > 0 ? perPage * (page - 1) : 0;
        const taskIds = await this.repository.find( {
            where: where,
            skip : skip,
            take : perPage,
            order : { date : "DESC" },
            select : ["id"]
        });
        const [data, total] = await this.repository.findAndCount({
            where : { id : In( taskIds.map( task => task.id ) ) },
            relations: ['appoinment.customer', 'userInCharge'],
            take: perPage,
            skip,
            order: { date : "DESC" },
        });

        const lastPage = Math.ceil(total / perPage);
        return {
            items: data,
            meta: {
                itemCount: data.length,
                totalItems: total,
                itemsPerPage: perPage,
                totalPages: lastPage,
                currentPage: page,
                next: page < lastPage ? page + 1 : null,
            },
        };
    }


    async updateBulk (data: UpdateCustomerProductBulkDto) {
        const updatedData = await this.repository.createQueryBuilder('Task')
            .update(Task)
            .set({ status: data.status })
            .where('"task"."id" IN (:...ids)', { ids: data.ids })
            .returning("*") // returns all the column values
            .updateEntity(true)
            .execute();
        return updatedData.raw[0];
    }

    async updateStatus (id: string, data: UpdateTaskStatusDto) {
        const updatedData = await this.repository.createQueryBuilder('Task')
            .update(Task)
            .set({ status: data.status })
            .where('"task"."id" = :id', { id: id })
            .returning("*") // returns all the column values
            .updateEntity(true)
            .execute();
        return updatedData.raw[0];
    }
}