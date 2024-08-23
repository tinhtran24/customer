import { Type } from "@nestjs/common";
import { ClassTransformOptions } from "class-transformer";

export type CrudMethod =
    | 'detail'
    | 'delete'
    | 'restore'
    | 'list'
    | 'store'
    | 'update'
    | 'deleteMulti'
    | 'restoreMulti';


export interface CrudMethodOption {
    allowGuest?: boolean;
    serialize?: ClassTransformOptions | 'noGroup';
}

export interface CrudItem {
    name: CrudMethod;
    options?: CrudMethodOption;
}


export interface CrudOptions {
    id: string;
    enabled: Array<CrudMethod | CrudItem>;
    dtos: {
        [key in 'query' | 'create' | 'update']?: Type<any>;
    };
}