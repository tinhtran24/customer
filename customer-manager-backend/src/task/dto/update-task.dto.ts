import { IsNotEmpty, IsString, IsUUID, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    appoinmentId: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    label: string;
  
    @IsString()
    @IsNotEmpty()
    description: string
  
    @IsDate()
    @IsNotEmpty()
    date: Date
  }