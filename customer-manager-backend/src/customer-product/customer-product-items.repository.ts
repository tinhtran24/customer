import { CustomRepository } from "src/core/decorator/repository.decorator";
import { CustomerProductItem } from "./entities/product-customer.entity";
import { OrderType } from "src/core/type/query";
import { BaseRepository } from "src/core/base/base.repository";

@CustomRepository(CustomerProductItem)
export class CustomerProductItemRepository extends BaseRepository<CustomerProductItem> {
    protected qbName = 'CustomerProductItem';

    protected orderBy = { name: 'createdAt', order: OrderType.ASC };

    protected relations = ['product'];

}