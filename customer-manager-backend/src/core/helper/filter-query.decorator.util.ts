import { getMetadataStorage } from 'class-validator'
import { ApiQuery } from '@nestjs/swagger'
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata'
import { Between } from "typeorm";
import { format } from "date-fns";

const metaDataStorage = getMetadataStorage()

enum QueryConstraints {
  Int = 'isInt',
  String = 'isString',
  Boolean = 'isBoolean',
  Enum = 'isEnum'
}

const metadata2ApiQuery = (
  item: ValidationMetadata
): MethodDecorator | undefined => {
  switch (item.name) {
    case QueryConstraints.Int:
      return ApiQuery({
        name: item.propertyName,
        type: Number,
        required: false
      })
    case QueryConstraints.String:
      return ApiQuery({
        name: item.propertyName,
        type: String,
        required: false
      })
    case QueryConstraints.Boolean:
      return ApiQuery({
        name: item.propertyName,
        type: Boolean,
        required: false
      })
    case QueryConstraints.Enum:
      return ApiQuery({
        name: item.propertyName,
        enum: item.constraints[0],
        required: false
      })
    default:
      return undefined
  }
}

export const FilterQueries = (readFilterDto?: Function): MethodDecorator[] =>
  readFilterDto
    ? (metaDataStorage
        .getTargetValidationMetadatas(readFilterDto, '', false, false)
        .map(metadata2ApiQuery)
        .filter(Boolean) as MethodDecorator[])
    : []


export const BetweenDates = (from: Date | string, to: Date | string) =>
    Between(
        format(typeof from === 'string' ? new Date(from) : from, 'YYYY-MM-DD HH:MM:SS'),
        format(typeof to === 'string' ? new Date(to) : to, 'YYYY-MM-DD HH:MM:SS'),
    );