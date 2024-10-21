import { Injectable } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsUUID, Min } from "class-validator";
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
    @ApiPropertyOptional()
    from: Date;

    @IsOptional()
    @ApiProperty()
    @ApiPropertyOptional()
    to: Date;
    
    @IsOptional()
    @ApiProperty()
    @ApiPropertyOptional()
    q?: string;

    @IsOptional()
    @ApiProperty()
    @ApiPropertyOptional()
    status?: string;

    @IsUUID()
    @IsOptional()
    @ApiProperty()
    @ApiPropertyOptional()
    userInChargeId?: string;
}