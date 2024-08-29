import { IsNotEmpty, IsNumber, IsString, IsUUID, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  customerId: string;
}
