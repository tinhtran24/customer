import { CustomRepository } from "src/core/decorator/repository.decorator";
import Customer from "./entities/customer.entity";
import { OrderType } from "src/core/type/query";
import { BaseRepository } from "src/core/base/base.repository";

@CustomRepository(Customer)
export class CustomerRepository extends BaseRepository<Customer> {
    protected qbName = 'Customer';

    protected orderBy = { name: 'updatedAt', order: OrderType.ASC };

    protected relations = ['ward.district.province', 'userInCharge']
}