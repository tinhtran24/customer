import { CustomRepository } from "src/core/decorator/repository.decorator";
import { CustomerProduct } from "./entities/product-customer.entity";
import { OrderType } from "src/core/type/query";
import { BaseRepository } from "src/core/base/base.repository";

@CustomRepository(CustomerProduct)
export class CustomerProductRepository extends BaseRepository<CustomerProduct> {
    protected qbName = 'CustomerProduct';

    protected orderBy = { name: 'createdAt', order: OrderType.ASC };

    protected relations = ['customer', 'customerProductItems', 'createdUser', 'updatedUser'];
}