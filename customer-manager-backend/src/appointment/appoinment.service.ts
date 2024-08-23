import { Appoinment } from "./entities/appointment.entity";
import { Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base.service";
import { AppoinmentRepository } from "./appoinment.repository";

@Injectable()
export class AppoinmentService extends BaseService<Appoinment, AppoinmentRepository> {
    constructor(protected appoinmentRepository: AppoinmentRepository) {
        super(appoinmentRepository);
      }
    
      protected enable_trash = true;
}