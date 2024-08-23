import { Paramtype, SetMetadata } from '@nestjs/common';
import { ClassTransformOptions } from '@nestjs/common/interfaces/external/class-transform-options.interface';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';


export const DTO_VALIDATION_OPTIONS = 'dto_validation_options';

export const DtoValidation = (
    options?: ValidatorOptions & {
        transformOptions?: ClassTransformOptions;
    } & { type?: Paramtype },
) => SetMetadata(DTO_VALIDATION_OPTIONS, options ?? {});