import { CustomRepository } from "src/core/decorator/repository.decorator";
import { Product } from "./entities/product.entity";
import { BaseTreeRepository } from "src/core/base/base.tree.repository";
import { OrderType } from "src/core/type/query";

@CustomRepository(Product)
export class ProductRepository extends BaseTreeRepository<Product> {
    protected qbName = 'Product';

    protected orderBy = { name: 'createdAt', order: OrderType.ASC };
}