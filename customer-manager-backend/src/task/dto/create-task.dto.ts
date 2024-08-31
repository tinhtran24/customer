import { IsNotEmpty, IsString, IsUUID, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
    @IsUUID()
    @IsOptional()
    @ApiProperty()
    appoinmentId: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    code: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    userInChargeId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string
  
    @IsDate()
    @IsNotEmpty()
    @ApiProperty()
    date: Date
  }