import { CustomRepository } from "src/core/decorator/repository.decorator";
import { Product } from "./entities/product.entity";
import { OrderType } from "src/core/type/query";
import { BaseRepository } from "src/core/base/base.repository";

@CustomRepository(Product)
export class ProductRepository extends BaseRepository<Product> {
    protected qbName = 'Product';

    protected orderBy = { name: 'updatedAt', order: OrderType.DESC };

    protected relations = ['productWarehouses'];

}