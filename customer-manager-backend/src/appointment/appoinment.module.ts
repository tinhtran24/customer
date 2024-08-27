import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appoinment } from './entities/appointment.entity';
import { AppoinmentController } from './appoinment.controller';
import { AppoinmentService } from './appoinment.service';
import { AppoinmentRepository } from './appoinment.repository';
import { DatabaseModule } from 'src/database/database.module';
import { TaskService } from 'src/task/task.service';
import { TaskRepository } from 'src/task/task.repository';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appoinment]),
    DatabaseModule.forRepository([AppoinmentRepository]),
    DatabaseModule.forRepository([TaskRepository]),
    forwardRef(() => TaskModule)
  ],
  controllers: [AppoinmentController],
  providers: [AppoinmentService, TaskService],
})
export class AppoinmentModule {}
