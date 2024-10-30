import { getMetadataStorage } from 'class-validator'
import { ApiQuery } from '@nestjs/swagger'
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata'
import { Between, FindOperator, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { format, parseISO } from "date-fns";
import { DateUtil } from 'src/utils/date';

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

export const dateTimeFormat = 'yyyy-MM-dd HH:mm:ss.SSS'
export const dateFormat = 'yyyy-MM-dd'

export const BetweenDates = (from?: Date, to?: Date): FindOperator<string> => {
    if (from && to) {
        return Between(
            format(parseISO(DateUtil.beginOfTheDay(from).toISOString()), dateFormat),
            format(parseISO(DateUtil.endOfTheDay(to).toISOString()), dateFormat),
        )
    }

    if (!from && to) {
        return LessThanOrEqual(format(parseISO(DateUtil.endOfTheDay(from).toISOString()), dateFormat))
    }

    if (from && !to) {
        return MoreThanOrEqual(format(parseISO(DateUtil.beginOfTheDay(from).toISOString()), dateFormat))
    }

    throw new Error('`from` and `to` are both null')
}

export const BetweenDateTimes = (from?: Date, to?: Date): FindOperator<string> => {
    if (from && to) {
        return Between(
            format(parseISO(DateUtil.beginOfTheDay(from).toISOString()), dateTimeFormat),
            format(parseISO(DateUtil.endOfTheDay(to).toISOString()), dateTimeFormat),
        )
    }

    if (!from && to) {
        return LessThanOrEqual(format(parseISO(DateUtil.endOfTheDay(from).toISOString()), dateTimeFormat))
    }

    if (from && !to) {
        return MoreThanOrEqual(format(parseISO(DateUtil.beginOfTheDay(from).toISOString()), dateTimeFormat))
    }

    throw new Error('`from` and `to` are both null')
}