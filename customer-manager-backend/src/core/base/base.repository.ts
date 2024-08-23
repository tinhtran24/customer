import { isNil } from 'lodash';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { OrderQueryType, OrderType } from '../type/query';
import { getOrderByQuery } from '../pagination/paginate';


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
}