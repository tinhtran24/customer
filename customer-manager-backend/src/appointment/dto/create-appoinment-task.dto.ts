import { CreateTaskDto } from "src/task/dto/create-task.dto";
import { CreateScheduleDto } from "./create-appoinment.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAppointmentIncludeTasks {
    @ApiProperty()
    createScheduleDto: CreateScheduleDto
    
    @ApiProperty()
    createTaskDto: CreateTaskDto[]
}