import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(40)
    readonly newPassword: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly oldPassword: string;
  }
  