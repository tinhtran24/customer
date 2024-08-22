/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PaginationDto } from './base.dto';
import { BaseEntity } from './base.entity';
import { BaseService } from './base.service';
import { ApiCreate, ApiDelete, ApiGetAll, ApiGetDetail, ApiUpdate } from './base.swagger';
import { ApiBearerAuth } from '@nestjs/swagger';

export function BaseController<Entity extends BaseEntity>($ref: any, name?: string) {
    abstract class Controller {
        abstract relations: string[];

        constructor(public readonly service: BaseService<Entity>) {}

        @Post('')
        @ApiCreate($ref, name)
        @ApiBearerAuth()
        create(@Body() body): Promise<Entity> {
            return this.service.create(body);
        }

        @Get('')
        @ApiGetAll($ref, name)
        @ApiBearerAuth()
        getAll(@Query() query: PaginationDto): Promise<[Entity[], number]> {
            return this.service.getAllWithPagination(
                query,
                {},
                //@ts-ignore
                { createdAt: 'DESC' },
                ...this.relations
            );
        }

        @Get(':id')
        @ApiGetDetail($ref, name)
        @ApiBearerAuth()
        getDetail(@Param('id') id: string): Promise<Entity> {
            return this.service.getOneByIdOrFail(id, ...this.relations);
        }

        @Patch(':id')
        @ApiUpdate($ref, name)
        @ApiBearerAuth()
        update(@Param('id') id: string, @Body() body): Promise<Entity> {
            return this.service.updateById(id, body);
        }

        @Delete(':id')
        @ApiDelete($ref, name)
        @ApiBearerAuth()
        delete(@Param('id') id: string): Promise<Entity> {
            return this.service.softDeleteById(id);
        }
    }

    return Controller;
}