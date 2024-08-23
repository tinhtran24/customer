import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appoinment } from './entities/appointment.entity';
import { AppoinmentController } from './appoinment.controller';
import { AppoinmentService } from './appoinment.service';
import { AppoinmentRepository } from './appoinment.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appoinment]),
    DatabaseModule.forRepository([AppoinmentRepository]),
  ],
  controllers: [AppoinmentController],
  providers: [AppoinmentService],
})
export class AppoinmentModule {}
