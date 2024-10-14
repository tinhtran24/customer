import React, { useEffect, useState } from "react";
import { DatePicker, Input, Select, Button, Row, Col, message } from "antd";
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
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const getUsers = async () => {
    setIsLoadingUsers(true);
    const results = await fetchUsers();
    if (results.statusCode == 500) {
      message.error(
          Array.isArray(results.message) ? results.message[0] : results.message
      );
    } else {
      setUsers(results);
    }
    setIsLoadingUsers(false);
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
      removeFilter(handleFilterReset, OrderFilterKey.DATE);
    }
  };

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilter({
      customerName: e.target.value,
    });
    if (e.target.value === "")
      removeFilter(handleFilterReset, OrderFilterKey.CUSTOMER_NAME);
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

  const handleCustomerStatusChange = (value: string) => {
    onFilter({
      customerStatus: value,
    });
  };

  const handleOrderStatusChange = (value: string) => {
    onFilter({
      status: value,
    });
  };

  return (
    <Row gutter={[16, 16]} style={{ margin: "1rem 0 2rem 0" }}>
      <Col span={3} style={{ paddingLeft: "0" }}>
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
      <Col span={4}>
        <Input
          placeholder="Tên khách hàng"
          onChange={handleCustomerNameChange}
          value={filtersValue?.customerName || ""}
          allowClear
        />
      </Col>
      <Col span={4}>
        <Select
          placeholder="- Chọn tên nhân viên -"
          style={{ width: "100%" }}
          onChange={handleSaleChange}
          value={filtersValue?.sale}
          allowClear
          onClear={() => removeFilter(handleFilterReset, OrderFilterKey.SALE)}
          loading={isLoadingUsers}
        >
          {Array.isArray(users) && users.map((user) => (
            <Option key={user.id} value={user.name}>
              {`${user.name} - ${user.email}`}
            </Option>
          ))}
        </Select>
      </Col>
      <Col span={3}>
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
      <Col span={3}>
        <SettingSelect
          value={filtersValue.customerStatus || null}
          placeholder="- Chọn trạng thái khách hàng -"
          onChange={handleCustomerStatusChange}
          style={{ width: "100%" }}
          type={SETTINGS_TYPE.STATUS}
          allowClear
          onClear={() => removeFilter(handleFilterReset, OrderFilterKey.CUSTOMER_STATUS)}
        />
      </Col>
      <Col span={3}>
        <SettingSelect
            value={filtersValue.status || null}
            placeholder="- Chọn trạng thái đơn hàng -"
            onChange={handleOrderStatusChange}
            style={{ width: "100%" }}
            type={SETTINGS_TYPE.ORDER_STATUS}
            allowClear
            onClear={() => removeFilter(handleFilterReset, OrderFilterKey.STATUS)}
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
