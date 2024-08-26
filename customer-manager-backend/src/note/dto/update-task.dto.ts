import { IsNotEmpty, IsString, IsUUID, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNoteDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  description: string
}