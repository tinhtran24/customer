import React, { useEffect, useState } from "react";
import { DatePicker, Input, Select, Button, Row, Col } from "antd";
import moment, { Moment } from "moment";
import { SettingSelect } from "../Common/Select";
import { SETTINGS_TYPE, User } from "@/app/lib/definitions";
import { Dayjs } from "dayjs";
import { fetchUsers } from "@/app/lib/actions";
import { FilterValues, ParamsReset } from "./order.interface";
import { OrderFilterKey, removeFilter } from "./LabelFilter";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface OrderFilterProps {
  filtersValue: FilterValues;
  onFilter: (filters: Partial<FilterValues>) => void;
  onSearch: any;
  handleResetAll: () => void;
  handleFilterReset: (params: ParamsReset) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({
  filtersValue,
  onFilter,
  onSearch,
  handleResetAll,
  handleFilterReset,
}) => {
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async () => {
    const results = await fetchUsers();
    setUsers(results);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates) {
      const momentDates: [Moment | null, Moment | null] = [
        dates[0] ? moment(dates[0].toDate()) : null,
        dates[1] ? moment(dates[1].toDate()) : null,
      ];
      onFilter({
        from: momentDates[0]?.toDate() || null,
        to: momentDates[1]?.toDate() || null,
      });
    } else {
      onFilter({
        from: null,
        to: null,
      });
      removeFilter(handleFilterReset, OrderFilterKey.DATE)
    }
  };

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilter({
      customerName: e.target.value,
    });
    if(e.target.value === '')
      removeFilter(handleFilterReset, OrderFilterKey.CUSTOMER_NAME)
  };

  const handleSaleChange = (value: string) => {
    onFilter({
      sale: value,
    });
  };

  const handleSourceOfGoodChange = (value: string) => {
    onFilter({
      source: value,
    });
  };

  return (
    <Row gutter={[16, 16]} style={{ margin: "1rem 0 2rem 0" }}>
      <Col span={5} style={{ paddingLeft: "0" }}>
        <RangePicker
          onChange={handleDateChange}
          style={{ width: "100%" }}
          value={
            filtersValue.from &&
            filtersValue.to &&
            ([moment(filtersValue.from), moment(filtersValue.to)] as [
              Dayjs,
              Dayjs
            ])
          }
        />
      </Col>
      <Col span={5}>
        <Input
          placeholder="Tên khách hàng"
          onChange={handleCustomerNameChange}
          value={filtersValue?.customerName || ""}
          allowClear
        />
      </Col>
      <Col span={5}>
        <Select
          placeholder="- Chọn tên nhân viên -"
          style={{ width: "100%" }}
          onChange={handleSaleChange}
          value={filtersValue?.sale}
          allowClear
          onClear={() => removeFilter(handleFilterReset, OrderFilterKey.SALE)}
        >
          {users?.map((user) => (
            <Option key={user.id} value={user.name}>
              {`${user.name} - ${user.email}`}
            </Option>
          ))}
        </Select>
      </Col>
      <Col span={5}>
        <SettingSelect
          type={SETTINGS_TYPE.SOURCE_OF_GOODS}
          style={{ width: "100%" }}
          placeholder="- Chọn nguồn hàng -"
          onChange={handleSourceOfGoodChange}
          value={filtersValue?.source}
          allowClear
          onClear={() => removeFilter(handleFilterReset, OrderFilterKey.SOURCE)}
        />
      </Col>
      <Col span={4}>
        <Button type="primary" onClick={onSearch}>
          Lọc
        </Button>
        <Button
          type="primary"
          onClick={() => handleResetAll()}
          style={{
            marginLeft: "10px",
            background: "white",
            border: "1px solid blue",
            color: "blue",
          }}
        >
          Bỏ lọc
        </Button>
      </Col>
    </Row>
  );
};

export default OrderFilter;
