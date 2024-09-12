import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { isNil } from 'lodash';
import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { IsNull, Not, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from './base.repository';
import { BaseTreeRepository } from './base.tree.repository';
import { QueryHook, QueryListParams, QueryParams, QueryTrashMode } from '../type/query';
import { PaginateDto } from './base.dto';
import { manualPaginate } from '../pagination/paginate';

/**
 * @description CURD
 * @export
 * @abstract
 * @class BaseService
 * @template E 
 * @template P 
 * @template M 
 */
export abstract class BaseService<
    E extends ObjectLiteral,
    R extends BaseRepository<E> | BaseTreeRepository<E>,
    P extends QueryListParams<E> = QueryListParams<E>,
    M extends IPaginationMeta = IPaginationMeta,
> {
    /**
     * @description
     * @protected
     * @type {DataServiceRepo<E>}
     */
    protected repository: R;

    /**
     * @description
     * @protected
     */
    protected enable_trash = false;
    protected enable_generate_code = false;
    protected code_prefix = 'SYSTEM';

    constructor(repository: R) {
        this.repository = repository;
        if (
            !(
                this.repository instanceof BaseRepository ||
                this.repository instanceof BaseTreeRepository
            )
        ) {
            throw new Error(
                'Repository must instance of BaseRepository or BaseTreeRepository in DataService!',
            );
        }
    }

    /**
     * @description 
     * @param {P} [params]
     * @param {QueryHook<E>} [callback]
     */
    async list(params?: P, callback?: QueryHook<E>): Promise<E[]> {
        const options = params ?? ({} as P);
        // @ts-ignore
        const queryName = this.repository.getQBName();
        const trashed = options.trashed ?? QueryTrashMode.NONE;
        if (this.repository instanceof BaseTreeRepository) {
            let addQuery: QueryParams<E>['addQuery'];
            if (trashed === QueryTrashMode.ONLY) {
                addQuery = (qb) => qb.where(`${queryName}.deletedAt IS NOT NULL`);
            }
            const tree = await this.repository.findTrees({
                ...options,
                addQuery,
                withTrashed: trashed === QueryTrashMode.ALL || trashed === QueryTrashMode.ONLY,
            });
            return this.repository.toFlatTrees(tree);
        }
        const qb = await this.buildListQuery(this.repository.buildBaseQuery(), options, callback);
        return qb.getMany();
    }
    
    async generateCode(incrementBy: number = 1) {
        const lastRecord = await this.repository.find({
          take:1,
          order: { createdAt: 'DESC' } as any
        });
        let newCode = 1;
        if (lastRecord && lastRecord[0].code) {
            newCode =
            parseInt(lastRecord[0].code.slice(-6), 10) + incrementBy;
        }
        const now= new Date();
        const year = now.getFullYear();
        return `${this.code_prefix}_${year}${newCode.toString().padStart(6, "0")}`;
      }

    async findPaginate(
        options: PaginateDto<M> & P,
        where?: any
    ){
        return this.repository.findPaginate(options, where);
    }
    
    /**
     * @description 
     * @param {PaginateDto<M>} options
     * @param {P} [params]
     * @param {QueryHook<E>} [callback]
     */
    async paginate(
        options: PaginateDto<M> & P,
        callback?: QueryHook<E>,
    ): Promise<Pagination<E, M>> {
        const queryOptions = options ?? ({} as P);
        if (this.repository instanceof BaseTreeRepository) {
            const data = await this.list(queryOptions, callback);
            return manualPaginate(options, data) as Pagination<E, M>;
        }
        const query = await this.buildListQuery(
            this.repository.buildBaseQuery(),
            queryOptions,
            callback,
        );
        return paginate(query, options);
    }

    /**
     * @description 
     * @param {string} id
     * @param {QueryHook<E>} [callback]
     * @returns {*}  {Promise<E>}
     */
    async detail(id: string, trashed?: boolean, callback?: QueryHook<E>): Promise<E> {
        const query = await this.buildItemQuery(this.repository.buildBaseQuery(), callback);
        const qb = query.where(`${this.repository.getQBName()}.id = :id`, { id });
        if (trashed) qb.withDeleted();
        const item = await qb.getOne();
        if (!item) throw new NotFoundException(`${this.repository.getQBName()} ${id} not exists!`);
        return item;
    }

    /**
     * @description 
     * @param {*} data
     * @returns {*}  {Promise<E>}
     */
    async create(data: any): Promise<E> {
        try {
            if (this.enable_generate_code) {
                data = {
                    ...data,
                    code: await this.generateCode()
                }
            }
            return this.repository.save(data, { reload: true }) 
        } catch {
            throw new ForbiddenException(`Can not to create ${this.repository.getQBName()}!`);
        }
    }

    /**
     * @description 
     * @param {*} data
     * @param {string} id
     * @returns {*}  {Promise<E>}
     */
    async update(id: string, data: any): Promise<E> {
        try {
            await this.repository.update(id, data);
            return this.repository.findOneOrFail({
                where: { id } as any,
                withDeleted: this.enable_trash ? true : undefined,
            });
        } catch {
            throw new ForbiddenException(`Can not to update ${this.repository.getQBName()}!`);
        }
    }

    /**
     * 
     * @param id
     * @param trash
     */
    async delete(id: string, trash = true) {
        const item = await this.repository.findOneOrFail({
            where: { id } as any,
            withDeleted: this.enable_trash ? true : undefined,
        });
        if (this.enable_trash && trash && isNil(item.deletedAt)) {
            // await this.repository.softRemove(item);
            (item as any).deletedAt = new Date();
            if (this.repository instanceof BaseTreeRepository) {
                const dt = await this.repository.findDescendantsTree(item);
                (item as any).parent = null;
                for (const child of dt.children) {
                    child.parent = null;
                    await this.repository.save(child);
                }
            }
            await (this.repository as any).save(item);
            return this.detail(id, true);
        }
        return this.repository.remove(item);
    }

    /**
     * @description 
     * @param {string[]} data
     * @param {P} [params]
     * @param {boolean} [trash]
     * @param {QueryHook<E>} [callback]
     * @returns 
     */
    async deleteList(data: string[], params?: P, trash?: boolean, callback?: QueryHook<E>) {
        const isTrash = trash === undefined ? true : trash;
        for (const id of data) {
            await this.delete(id, isTrash);
        }
        return this.list(params, callback);
    }

    /**
     * @description 
     * @param {string[]} data
     * @param {PaginateDto<M>} pageOptions
     * @param {P} [params]
     * @param {boolean} [trash]
     * @param {QueryHook<E>} [callback]
     * @returns 
     */
    async deletePaginate(
        data: string[],
        options: PaginateDto<M> & P,
        trash?: boolean,
        callback?: QueryHook<E>,
    ) {
        const isTrash = trash === undefined ? true : trash;
        for (const id of data) {
            await this.delete(id, isTrash);
        }
        return this.paginate(options, callback);
    }

    /**
     * 
     * @param id
     * @param callback
     */
    async restore(id: string, callback?: QueryHook<E>) {
        if (!this.enable_trash) {
            throw new ForbiddenException(
                `Can not to retore ${this.repository.getQBName()},because trash not enabled!`,
            );
        }
        const item = await this.repository.findOneOrFail({
            where: { id } as any,
            withDeleted: true,
        });
        if ((item as any).deletedAt) {
            await this.repository.restore(item.id);
        }
        return this.detail(item.id, false, callback);
    }

    /**
     * @description 
     * @param {string[]} data
     * @param {P} [params]
     * @param {QueryHook<E>} [callback]
     * @returns
     */
    async restoreList(data: string[], params?: P, callback?: QueryHook<E>) {
        for (const id of data) {
            await this.restore(id);
        }
        return this.list(params, callback);
    }

    /**
     * @description 
     * @param {string[]} data
     * @param {PaginateDto<M>} pageOptions
     * @param {*} [params]
     * @param {QueryHook<E>} [callback]
     * @returns 
     */
    async restorePaginate(data: string[], options: PaginateDto<M> & P, callback?: QueryHook<E>) {
        for (const id of data) {
            await this.restore(id);
        }
        return this.paginate(options, callback);
    }

    /**
     * @description QueryBuilder
     * @protected
     * @param {SelectQueryBuilder<E>} query
     * @param {QueryHook<E>} [callback]
     */
    protected async buildItemQuery(query: SelectQueryBuilder<E>, callback?: QueryHook<E>) {
        if (callback) return callback(query);
        return query;
    }

    /**
     * QueryBuilder
     * @param qb
     * @param options
     * @param callback
     */
    protected async buildListQuery(qb: SelectQueryBuilder<E>, options: P, callback?: QueryHook<E>) {
        const queryName = this.repository.getQBName();
        const { trashed } = options;
        if (trashed === QueryTrashMode.ALL || trashed === QueryTrashMode.ONLY) {
            qb.withDeleted();
            if (trashed === QueryTrashMode.ONLY) {
                qb.where(`${queryName}.deletedAt = :deleted`, { deleted: Not(IsNull()) });
            }
        }
        if (callback) return callback(qb);
        return qb;
    }
}