import { CustomRepository } from "src/core/decorator/repository.decorator";
import { ProductWarehouse } from "./entities/product-warehouse.entity";
import { BaseRepository } from "src/core/base/base.repository";
import { OrderType } from "src/core/type/query";

@CustomRepository(ProductWarehouse)
export class ProductWarehouseRepository extends BaseRepository<ProductWarehouse> {
    protected qbName = 'ProductWarehouse';

    protected orderBy = { name: 'updatedAt', order: OrderType.DESC };

    protected relations = ['product', 'productWarehouseLogs.product', 'productWarehouseLogs.createdUser'];

}