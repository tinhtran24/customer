import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { IPaginationMeta } from 'nestjs-typeorm-paginate';
import { QueryListParams, TrashedDto } from '../type/query';
import { DeleteDto, DeleteMultiDto, DeleteRestoreDto, PaginateDto, QueryDetailDto } from './base.dto';

/**
 * @description
 * @export
 * @class BaseController
 */
export abstract class BaseController<
    S,
    P extends QueryListParams<any> = QueryListParams<any>,
    M extends IPaginationMeta = IPaginationMeta,
> {
    protected service: S;

    constructor(service: S) {
        this.setService(service);
    }

    private setService(service: S) {
        this.service = service;
    }

    @Get()
    async list(@Query() options: PaginateDto<M> & P & TrashedDto, ...args: any[]) {
        return (this.service as any).findPaginate(options);
    }

    @Get(':item')
    async detail(
        @Query() { trashed }: QueryDetailDto,
        @Param('item', new ParseUUIDPipe())
        item: string,
        ...args: any[]
    ) {
        return (this.service as any).detail(item, trashed);
    }

    @Post()
    async store(
        @Body()
        data: any,
        ...args: any[]
    ) {
        return (this.service as any).create(data);
    }

    @Patch()
    async update(
        @Body()
        data: any,
        ...args: any[]
    ) {
        return (this.service as any).update(data);
    }

    @Delete(':item')
    async delete(
        @Param('item', new ParseUUIDPipe())
        item: string,
        @Body()
        { trash }: DeleteDto,
        ...args: any[]
    ) {
        return (this.service as any).delete(item, trash);
    }

    @Delete()
    async deleteMulti(
        @Query()
        options: PaginateDto<M> & TrashedDto & P,
        @Body()
        { trash, items }: DeleteMultiDto,
        ...args: any[]
    ) {
        return (this.service as any).deletePaginate(items, options, trash);
    }

    @Patch('restore/:item')
    async restore(
        @Param('item', new ParseUUIDPipe())
        item: string,
        ...args: any[]
    ) {
        return (this.service as any).restore(item);
    }

    @Patch('restore')
    async restoreMulti(
        @Query()
        options: PaginateDto<M> & TrashedDto & P,
        @Body()
        { items }: DeleteRestoreDto,
        ...args: any[]
    ) {
        return (this.service as any).restorePaginate(items, options);
    }
}