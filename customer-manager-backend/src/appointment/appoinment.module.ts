import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appoinment } from './entities/appointment.entity';
import { AppoinmentController } from './appoinment.controller';
import { AppoinmentService } from './appoinment.service';
import { AppoinmentRepository } from './appoinment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Appoinment])],
  controllers: [AppoinmentController],
  providers: [AppoinmentService, AppoinmentRepository],
})
export class AppoinmentModule {}
