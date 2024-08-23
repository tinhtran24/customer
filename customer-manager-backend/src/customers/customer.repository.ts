import { CustomRepository } from "src/core/decorator/repository.decorator";
import Customer from "./entities/customer.entity";
import { BaseTreeRepository } from "src/core/base/base.tree.repository";
import { OrderType } from "src/core/type/query";

@CustomRepository(Customer)
export class CustomerRepository extends BaseTreeRepository<Customer> {
    protected qbName = 'Customer';

    protected orderBy = { name: 'updatedAt', order: OrderType.ASC };
}