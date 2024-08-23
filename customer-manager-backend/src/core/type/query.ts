import { FindTreeOptions, ObjectLiteral, SelectQueryBuilder } from "typeorm";

export type QueryHook<Entity> = (
    hookQuery: SelectQueryBuilder<Entity>,
) => Promise<SelectQueryBuilder<Entity>>;


export type TreeQueryParams<E extends ObjectLiteral> = FindTreeOptions & QueryParams<E>;

export interface TrashedDto {
    trashed?: QueryTrashMode;
}

export enum QueryTrashMode {
    ALL = 'all', 
    ONLY = 'only', 
    NONE = 'none',
}

export enum OrderType {
    ASC = 'ASC',
    DESC = 'DESC',
}

export type OrderQueryType =
    | string
    | { name: string; order: `${OrderType}` }
    | Array<{ name: string; order: `${OrderType}` } | string>;


export interface QueryParams<E extends ObjectLiteral> {
    addQuery?: (query: SelectQueryBuilder<E>) => SelectQueryBuilder<E>;
    orderBy?: OrderQueryType;
    withTrashed?: boolean;
}

export type QueryListParams<E extends ObjectLiteral> = Omit<TreeQueryParams<E>, 'withTrashed'> & {
    trashed?: `${QueryTrashMode}`;
};