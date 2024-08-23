import {
    Delete,
    Get,
    NotFoundException,
    Patch,
    Post,
    SerializeOptions,
    Type,
} from '@nestjs/common';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { isNil } from 'lodash';
import { BaseController } from '../base/base.controller';
import { CrudItem, CrudOptions } from '../type/crud';
import { DeleteDto, DeleteRestoreDto } from '../base/base.dto';

/**
 * 
 * @param Target
 * @param options
 */
export const Crud = <T extends BaseController<any>>(options: CrudOptions) => {
    return function (Target: Type<T>) {
        const { id, enabled, dtos } = options;
        const methods: CrudItem[] = [];
        for (const value of enabled) {
            const item = (typeof value === 'string' ? { name: value } : value) as CrudItem;
            if (
                methods.map(({ name }) => name).includes(item.name) ||
                !isNil(Object.getOwnPropertyDescriptor(Target.prototype, item.name))
            )
                continue;
            methods.push(item);
        }

        for (const { name, options = {} } of methods) {
            if (isNil(Object.getOwnPropertyDescriptor(Target.prototype, name))) {
                const descriptor = Object.getOwnPropertyDescriptor(BaseController.prototype, name);

                Object.defineProperty(Target.prototype, name, {
                    ...descriptor,
                    value: {
                        async [name](...args: any[]) {
                            return descriptor.value.apply(this, args);
                        },
                    }[name],
                });
            }

            const descriptor = Object.getOwnPropertyDescriptor(Target.prototype, name);

            const [_, ...params] = Reflect.getMetadata('design:paramtypes', Target.prototype, name);

            if (name === 'store' && !isNil(dtos.create)) {
                Reflect.defineMetadata(
                    'design:paramtypes',
                    [dtos.create, ...params],
                    Target.prototype,
                    name,
                );
                ApiBody({ type: dtos.create })(Target, name, descriptor);
            } else if (name === 'update' && !isNil(dtos.update)) {
                Reflect.defineMetadata(
                    'design:paramtypes',
                    [dtos.update, ...params],
                    Target.prototype,
                    name,
                );
                ApiBody({ type: dtos.update })(Target, name, descriptor);
            } else if (name === 'list') {
                const dto = dtos.query;
                Reflect.defineMetadata(
                    'design:paramtypes',
                    [dto, ...params],
                    Target.prototype,
                    name,
                );
                // ApiQuery({ type: dtos.query })(Target, name, descriptor);
            } else if (name === 'delete') {
                ApiBody({ type: DeleteDto })(Target, name, descriptor);
            } else if (name === 'restore') {
                ApiBody({ type: DeleteRestoreDto })(Target, name, descriptor);
            }

            let serialize = {};
            if (isNil(options.serialize)) {
                if (['detail', 'create', 'update', 'delete', 'restore'].includes(name)) {
                    serialize = { groups: [`${id}-detail`] };
                } else if (['list'].includes(name)) {
                    serialize = { groups: [`${id}-list`] };
                }
            } else if (options.serialize === 'noGroup') {
                serialize = {};
            }
            SerializeOptions(serialize)(Target, name, descriptor);

            switch (name) {
                case 'list':
                    Get()(Target, name, descriptor);
                    break;
                case 'detail':
                    Get(':id')(Target, name, descriptor);
                    break;
                case 'store':
                    Post()(Target, name, descriptor);
                    break;
                case 'update':
                    Patch()(Target, name, descriptor);
                    break;
                case 'delete':
                    Delete()(Target, name, descriptor);
                    break;
                case 'restore':
                    Patch('restore')(Target, name, descriptor);
                    break;
                default:
                    break;
            }
        }

        const fixedProperties = ['constructor', 'service', 'setService'];
        for (const key of Object.getOwnPropertyNames(BaseController.prototype)) {
            const isEnabled = options.enabled.find((v) =>
                typeof v === 'string' ? v === key : (v as any).name === key,
            );
            if (!isEnabled && !fixedProperties.includes(key)) {
                let method = Object.getOwnPropertyDescriptor(Target.prototype, key);
                if (isNil(method))
                    method = Object.getOwnPropertyDescriptor(BaseController.prototype, key);
                Object.defineProperty(Target.prototype, key, {
                    ...method,
                    async value(..._args: any[]) {
                        return new NotFoundException();
                    },
                });
            }
        }
        return Target;
    };
};