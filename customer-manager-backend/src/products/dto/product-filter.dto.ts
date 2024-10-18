import { Injectable } from "@nestjs/common";
import { DtoValidation } from "../../core/decorator/validation.decorator";
import { PaginateDto } from "../../core/base/base.dto";
import { QueryTrashMode, TrashedDto } from "../../core/type/query";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsUUID, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Injectable()
@DtoValidation({ type: 'query' })
export class QueryProductDto implements PaginateDto, TrashedDto {
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
    @ApiPropertyOptional()
    title: string;

    
    @IsOptional()
    @ApiProperty()
    @ApiPropertyOptional()
    code: string;

    @IsOptional()
    @ApiProperty()
    @ApiPropertyOptional()
    @IsOptional()
    source: string;
}