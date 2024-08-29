import { isNil } from 'lodash';
import { FindOptionsWhere, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { OrderQueryType, OrderType } from '../type/query';
import { getOrderByQuery } from '../pagination/paginate';
import { PaginateDto } from './base.dto';
import { ServiceUnavailableException } from '@nestjs/common';


export abstract class BaseRepository<E extends ObjectLiteral> extends Repository<E> {
    /**
     * @description 
     * @protected
     * @abstract
     * @type {string}
     */
    protected abstract qbName: string;

    /**
     * @description 
     * @protected
     * @type {(string | { name: string; order:)}
     */
    protected orderBy?: string | { name: string; order: `${OrderType}` };

    protected relations?: string[]
    /**
     * 
     */
    buildBaseQuery(): SelectQueryBuilder<E> {
        return this.createQueryBuilder(this.qbName);
    }

    /**
     * 
     */
    getQBName() {
        return this.qbName;
    }

    /**
     * 
     * @param qb
     * @param orderBy
     */
    protected getOrderByQuery(qb: SelectQueryBuilder<E>, orderBy?: OrderQueryType) {
        const orderByQuery = orderBy ?? this.orderBy;
        return !isNil(orderByQuery) ? getOrderByQuery(qb, this.qbName, orderByQuery) : qb;
    }

    async findById(where: FindOptionsWhere<E> | FindOptionsWhere<E>[], p0: { id: string; }) {
        try {
            return await this.findOne({
              where,
              relations: this.relations,
            });
          } catch (error) {
            throw new ServiceUnavailableException();
          }
    }

    async findPaginate(
        paginate: PaginateDto,
        where?: any
    ) {
        const page = Number(paginate?.page || 1) || 1;
        const perPage = Number(paginate?.limit || 10) || 10;
    
        const skip = page > 0 ? perPage * (page - 1) : 0;
        const [data, total] = await this.findAndCount({
            where,
            relations: this.relations,
            take: perPage,
            skip,
        });
        const lastPage = Math.ceil(total / perPage);
    
        return {
          items: data,
          meta: {
            itemCount: data.length,
            totalItems: total,
            itemsPerPage: perPage,
            totalPages: lastPage,
            currentPage: page,
            next: page < lastPage ? page + 1 : null,
          },
        };
      }
}