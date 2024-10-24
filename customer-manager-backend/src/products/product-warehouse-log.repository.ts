import { CustomRepository } from "src/core/decorator/repository.decorator";
import { BaseRepository } from "src/core/base/base.repository";
import { OrderType } from "src/core/type/query";
import { ProductWarehouseLog } from "./entities/product-warerhouse-log.entity";

@CustomRepository(ProductWarehouseLog)
export class ProductWarehouseLogRepository extends BaseRepository<ProductWarehouseLog> {
    protected qbName = 'ProductWarehouseLog';

    protected orderBy = { name: 'updatedAt', order: OrderType.DESC };

    protected relations = ['product', 'createdUser'];

}