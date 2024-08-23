/* eslint-disable @typescript-eslint/no-useless-constructor */
import { isNil, pick, unset } from 'lodash';
import {
    EntityManager,
    EntityTarget,
    FindOptionsUtils,
    ObjectLiteral,
    QueryRunner,
    SelectQueryBuilder,
    TreeRepository,
    TreeRepositoryUtils,
} from 'typeorm';
import { OrderQueryType, OrderType, TreeQueryParams } from '../type/query';
import { getOrderByQuery } from '../pagination/paginate';

export class BaseTreeRepository<E extends ObjectLiteral> extends TreeRepository<E> {
    /**
     * @description 
     * @protected
     */
    protected qbName = 'treeEntity';

    /**
     * @description
     * @protected
     * @type {(string | { name: string; order:)}
     */
    protected orderBy?: string | { name: string; order: `${OrderType}` };

    constructor(target: EntityTarget<E>, manager: EntityManager, queryRunner?: QueryRunner) {
        super(target, manager, queryRunner);
    }

    /**
     * 
     */
    buildBaseQuery(): SelectQueryBuilder<E> {
        return this.createQueryBuilder(this.qbName).leftJoinAndSelect(
            `${this.getQBName()}.parent`,
            'parent',
        );
    }

    /**
     * 
     */
    getQBName() {
        return this.qbName;
    }

    /**
     * QueryBuilder
     * @param qb
     * @param orderBy
     */
    protected getOrderByQuery(qb: SelectQueryBuilder<E>, orderBy?: OrderQueryType) {
        const orderByQuery = orderBy ?? this.orderBy;
        return !isNil(orderByQuery) ? getOrderByQuery(qb, this.qbName, orderByQuery) : qb;
    }

    /**
     * 查询树
     * @param params
     */
    async findTrees(params: TreeQueryParams<E> = {}): Promise<E[]> {
        params.withTrashed = params.withTrashed ?? false;
        const roots = await this.findRoots(params);
        await Promise.all(roots.map((root) => this.findDescendantsTree(root, params)));
        return roots;
    }

    /**
     * 查询顶层列表
     * @param params
     */
    findRoots(params: TreeQueryParams<E> = {}): Promise<E[]> {
        const { addQuery, orderBy, withTrashed } = params;
        const escapeAlias = (alias: string) => this.manager.connection.driver.escape(alias);
        const escapeColumn = (column: string) => this.manager.connection.driver.escape(column);
        const parentPropertyName = this.manager.connection.namingStrategy.joinColumnName(
            this.metadata.treeParentRelation!.propertyName,
            this.metadata.primaryColumns[0].propertyName,
        );
        let qb = this.getOrderByQuery(this.createQueryBuilder(this.qbName), orderBy);
        FindOptionsUtils.applyOptionsToTreeQueryBuilder(qb, pick(params, ['relations', 'depth']));
        qb.where(`${escapeAlias(this.qbName)}.${escapeColumn(parentPropertyName)} IS NULL`);
        qb = addQuery ? addQuery(qb) : qb;
        if (withTrashed) qb.withDeleted();
        return qb.getMany();
    }

    /**
     * 查询后代列表
     * @param entity
     * @param params
     */
    findDescendants(entity: E, params: TreeQueryParams<E> = {}): Promise<E[]> {
        const qb = this.createDtsQueryBuilder('treeClosure', entity, params);
        FindOptionsUtils.applyOptionsToTreeQueryBuilder(qb, pick(params, ['relations', 'depth']));
        return qb.getMany();
    }

    /**
     * 查询后代树
     * @param entity
     * @param params
     */
    async findDescendantsTree(entity: E, params: TreeQueryParams<E> = {}): Promise<E> {
        const qb: SelectQueryBuilder<E> = this.createDtsQueryBuilder('treeClosure', entity, params);
        FindOptionsUtils.applyOptionsToTreeQueryBuilder(qb, pick(params, ['relations', 'depth']));
        const entities = await qb.getRawAndEntities();
        const relationMaps = TreeRepositoryUtils.createRelationMaps(
            this.manager,
            this.metadata,
            this.qbName,
            entities.raw,
        );
        TreeRepositoryUtils.buildChildrenEntityTree(
            this.metadata,
            entity,
            entities.entities,
            relationMaps,
            {
                depth: -1,
                ...pick(params, ['relations']),
            },
        );

        return entity;
    }

    /**
     * 查询后代数量
     * @param entity
     * @param params
     */
    countDescendants(entity: E, params: TreeQueryParams<E> = {}): Promise<number> {
        return this.createDtsQueryBuilder('treeClosure', entity, params).getCount();
    }

    /**
     * 创建后代查询器
     * @param closureTableAlias
     * @param entity
     * @param params
     */
    createDtsQueryBuilder(
        closureTableAlias: string,
        entity: E,
        params: TreeQueryParams<E> = {},
    ): SelectQueryBuilder<E> {
        const { addQuery, orderBy, withTrashed } = params;
        let qb = super.createDescendantsQueryBuilder(this.qbName, closureTableAlias, entity);
        qb = this.getOrderByQuery(qb, orderBy);
        qb = addQuery ? addQuery(qb) : qb;
        return withTrashed ? qb.withDeleted() : qb;
    }

    /**
     * 查询祖先列表
     * @param entity
     * @param params
     */
    findAncestors(entity: E, params: TreeQueryParams<E> = {}): Promise<E[]> {
        const qb = this.createAtsQueryBuilder('treeClosure', entity, params);
        FindOptionsUtils.applyOptionsToTreeQueryBuilder(qb, pick(params, ['relations', 'depth']));
        return qb.getMany();
    }

    /**
     * 查询祖先树
     * @param entity
     * @param params
     */
    async findAncestorsTree(entity: E, params: TreeQueryParams<E> = {}): Promise<E> {
        const qb = this.createAtsQueryBuilder('treeClosure', entity, params);
        FindOptionsUtils.applyOptionsToTreeQueryBuilder(qb, pick(params, ['relations', 'depth']));
        const entities = await qb.getRawAndEntities();
        const relationMaps = TreeRepositoryUtils.createRelationMaps(
            this.manager,
            this.metadata,
            this.qbName,
            entities.raw,
        );
        TreeRepositoryUtils.buildParentEntityTree(
            this.metadata,
            entity,
            entities.entities,
            relationMaps,
        );
        return entity;
    }

    /**
     * 查询祖先数量
     * @param entity
     * @param params
     */
    countAncestors(entity: E, params: TreeQueryParams<E> = {}): Promise<number> {
        return this.createAtsQueryBuilder('treeClosure', entity, params).getCount();
    }

    /**
     * 创建祖先查询器
     * @param closureTableAlias
     * @param entity
     * @param params
     */
    createAtsQueryBuilder(
        closureTableAlias: string,
        entity: E,
        params: TreeQueryParams<E> = {},
    ): SelectQueryBuilder<E> {
        const { addQuery, withTrashed, orderBy } = params;
        let qb = super.createAncestorsQueryBuilder(this.qbName, closureTableAlias, entity);
        qb = this.getOrderByQuery(qb, orderBy);
        qb = addQuery ? addQuery(qb) : qb;
        return withTrashed ? qb.withDeleted() : qb;
    }

    /**
     * 打平并展开树
     * @param trees
     * @param level
     */
    async toFlatTrees(trees: E[], level = 0): Promise<E[]> {
        const data: Omit<E, 'children'>[] = [];
        for (const item of trees) {
            (item as any).level = level;
            const { children } = item;
            unset(item, 'children');
            data.push(item);
            data.push(...(await this.toFlatTrees(children, level + 1)));
        }
        return data as E[];
    }
}