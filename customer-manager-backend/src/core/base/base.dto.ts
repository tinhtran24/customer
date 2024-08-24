import { Injectable } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNumber, IsNumberString, IsOptional, IsUUID, Min } from 'class-validator';
import { IPaginationMeta, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { DtoValidation } from '../decorator/validation.decorator';
import { Transform } from 'class-transformer';

@DtoValidation({ type: 'query' })
export class ListQueryDto  {
    @ApiPropertyOptional({
        description: 'page',
        minimum: 1,
        default: 1,
    })
    @Transform(({ value }) => Number(value))
    @Min(1, { message: 'Min 1' })
    @IsNumber()
    @IsOptional()
    page: number = 1;

    @ApiPropertyOptional({
        default: 10,
        type: Number,
        description: 'Per page',
    })
    @Transform(({ value }) => Number(value))
    @Min(1, { message: '5' })
    @IsNumber()
    @IsOptional()
    limit: number = 10;
}

export interface PaginateDto<C extends IPaginationMeta = IPaginationMeta>
    extends Omit<IPaginationOptions<C>, 'page' | 'limit'> {
    page: number;
    limit: number;
}

@Injectable()
@DtoValidation()
export class DeleteDto {
    @IsBoolean()
    @IsOptional()
    trash?: boolean;
}

@Injectable()
export class DeleteMultiDto extends DeleteDto {
    @IsUUID(undefined, {
        each: true,
        message: 'ID',
    })
    @IsDefined({
        each: true,
        message: 'ID',
    })
    items: string[] = [];
}

@Injectable()
export class QueryDetailDto {
    @IsBoolean()
    @IsOptional()
    trashed?: boolean;
}

@Injectable()
export class DeleteRestoreDto {
    @IsUUID(undefined, {
        each: true,
        message: 'ID',
    })
    @IsDefined({
        each: true,
        message: 'ID',
    })
    items: string[] = [];
}