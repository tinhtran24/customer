import { Injectable } from "@nestjs/common";
import { DtoValidation } from "../../core/decorator/validation.decorator";
import { PaginateDto } from "../../core/base/base.dto";
import { QueryTrashMode, TrashedDto } from "../../core/type/query";
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
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
    customerName: string;

    @IsOptional()
    @ApiProperty()
    saleName: string;

    @IsOptional()
    @ApiProperty()
    source: string;

    @IsOptional()
    @ApiProperty()
    userId: string;

    @IsOptional()
    @ApiProperty()
    from: Date;

    @IsOptional()
    @ApiProperty()
    to: Date;
}

@Injectable()
@DtoValidation({ type: 'query' })
export class QueryChartCustomerProductDto implements PaginateDto, TrashedDto {
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
    saleName: string;

    @IsOptional()
    @ApiProperty()
    source: string;

    @IsOptional()
    @ApiProperty()
    from: Date;

    @IsOptional()
    @ApiProperty()
    to: Date;

    @IsOptional()
    @ApiProperty()
    year: number;
}