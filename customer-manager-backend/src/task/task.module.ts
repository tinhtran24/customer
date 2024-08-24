import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { DatabaseModule } from 'src/database/database.module';
import { Task } from './entities/task.entity';
import { TaskController } from './task.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    DatabaseModule.forRepository([TaskRepository]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
