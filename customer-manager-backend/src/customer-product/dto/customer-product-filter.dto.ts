import { Injectable } from "@nestjs/common";
import { DtoValidation } from "../../core/decorator/validation.decorator";
import { PaginateDto } from "../../core/base/base.dto";
import { QueryTrashMode, TrashedDto } from "../../core/type/query";
import { IsBoolean, IsEnum, IsNumber, IsOptional, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";

@Injectable()
@DtoValidation({ type: 'query' })
export class QueryCustomerProductDto implements PaginateDto, TrashedDto {
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
    customerName: string;

    @IsOptional()
    @ApiProperty()
    @ApiPropertyOptional()
    saleName: string;

    @IsOptional()
    @ApiProperty()
    @ApiPropertyOptional()
    source: string;

    @IsOptional()
    @ApiProperty()
    @ApiPropertyOptional()
    customerStatus: string;

    @IsOptional()
    @ApiProperty()
    @ApiPropertyOptional()
    userId: string;

    @IsOptional()
    @ApiProperty()
    @ApiPropertyOptional()
    from: Date;

    @IsOptional()
    @ApiProperty()
    @ApiPropertyOptional()
    to: Date;
}

@Injectable()
@DtoValidation({ type: 'query' })
export class QueryChartCustomerProductDto {
    @IsEnum(QueryTrashMode)
    @IsOptional()
    trashed?: QueryTrashMode;

    @IsOptional()
    @ApiProperty()
    @ApiPropertyOptional()
    saleName: string;

    @IsOptional()
    @ApiProperty()
    @ApiPropertyOptional()
    source: string;

    @IsOptional()
    @ApiProperty()
    @ApiPropertyOptional()
    from: Date;

    @IsOptional()
    @ApiProperty()
    @ApiPropertyOptional()
    to: Date;

    @IsOptional()
    @ApiProperty()
    @ApiPropertyOptional()
    year: number;
}