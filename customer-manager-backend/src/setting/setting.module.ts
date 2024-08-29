import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { Setting } from './entities/setting.entity';
import { SettingRepository } from './setting.repository';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Setting]),
    DatabaseModule.forRepository([SettingRepository]),
  ],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}
