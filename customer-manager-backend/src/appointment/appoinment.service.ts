import { Appoinment } from "./entities/appointment.entity";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base.service";
import { AppoinmentRepository } from "./appoinment.repository";
import { PaginateDto } from "src/core/base/base.dto";

@Injectable()
export class AppoinmentService extends BaseService<Appoinment, AppoinmentRepository> {
    constructor(protected appoinmentRepository: AppoinmentRepository) {
        super(appoinmentRepository);
      }
    
      protected enable_trash = true;

      async getByCustomerId(customerId: string, options: PaginateDto) {
        return this.repository.findPaginate(options, {
            customerId
        });
        }
}