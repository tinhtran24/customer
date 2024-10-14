import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCustomerProductBulkDto {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Type(() => String)
    @ApiProperty()
    ids: string[]

    @IsString()
    @ApiProperty()
    status?: string;
}