import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";
import { PASSWORD_NOT_STRONG } from "src/utils/messageConstants";

export class ChangePasswordDto {
    @ApiProperty()
    @IsString()
    @IsStrongPassword(
        {
          minLength: 6,
          minUppercase: 1,
          minLowercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        },
        {
          message: PASSWORD_NOT_STRONG,
        }
    )
    readonly newPassword: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly oldPassword: string;
  }
  