import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional, Min } from "class-validator";
import { PaginateDto } from "src/core/base/base.dto";
import { DtoValidation } from "src/core/decorator/validation.decorator";
import { QueryTrashMode, TrashedDto } from "src/core/type/query";

@Injectable()
@DtoValidation({ type: 'query' })
export class QueryCustomertDto implements PaginateDto, TrashedDto {
    @Transform(({ value }) => Boolean(value))
    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;

    @IsEnum(QueryTrashMode)
    @IsOptional()
    trashed?: QueryTrashMode;

    @Transform(({ value }) => Number(value))
    @Min(1, { message: '1' })
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    page: number;

    @Transform(({ value }) => Number(value))
    @Min(1, { message: '1' })
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    limit: number;
    
    @IsOptional()
    @ApiProperty()
    q?: string;

    @IsOptional()
    @ApiProperty()
    status?: string;
}