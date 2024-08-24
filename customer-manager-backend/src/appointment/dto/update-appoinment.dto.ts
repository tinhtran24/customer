import { IsNotEmpty, IsNumber, IsString, IsUUID, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateScheduleDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  customerId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  userInChargeId: string;

  @IsString()
  @IsNotEmpty()
  customerGroup: string
}
