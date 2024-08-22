import { FindOptionsWhere } from 'typeorm';

export type TFindWhereOptions<Entity> =
	| FindOptionsWhere<Entity>
	| FindOptionsWhere<Entity>[];