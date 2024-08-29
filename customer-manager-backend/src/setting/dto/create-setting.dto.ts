import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrUpdateSettingDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    key: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    label: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    type: string;
}