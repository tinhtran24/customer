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
    code: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    userInChargeId: string;
  
    @IsDate()
    @IsNotEmpty()
    date: Date

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    status: string
}


export class UpdateTaskStatusDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    status: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string
}