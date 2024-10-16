import { Injectable } from "@nestjs/common";
import { DtoValidation } from "../../core/decorator/validation.decorator";
import { PaginateDto } from "../../core/base/base.dto";
import { QueryTrashMode, TrashedDto } from "../../core/type/query";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsUUID, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Injectable()
@DtoValidation({ type: 'query' })
export class QueryProductWarehouseDto implements PaginateDto, TrashedDto {
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

    @IsUUID()
    @ApiProperty()
    @ApiPropertyOptional()
    productId: string;

    @ApiProperty()
    @ApiPropertyOptional()
    source: string;
}