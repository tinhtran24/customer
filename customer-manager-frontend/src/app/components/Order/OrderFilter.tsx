import React, { useEffect, useState } from "react";
import { DatePicker, Input, Select, Button, Row, Col } from "antd";
import moment, { Moment } from "moment";
import { FilterValues } from "./Table";
import { SettingSelect } from "../Common/Select";
import { SETTINGS_TYPE, User } from "@/app/lib/definitions";
import { Dayjs } from "dayjs";
import { fetchUsers } from "@/app/lib/actions";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface OrderFilterProps {
  onFilter: (filters: Partial<FilterValues>) => void;
  onSearch: any;
  handleReset: () => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({
  onFilter,
  onSearch,
  handleReset,
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
    }
  };

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilter({
      customerName: e.target.value,
    });
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
      <Col span={5}>
        <RangePicker onChange={handleDateChange} style={{ width: "100%" }} />
      </Col>
      <Col span={5}>
        <Input
          placeholder="Tên khách hàng"
          onChange={handleCustomerNameChange}
        />
      </Col>
      <Col span={5}>
          <Select placeholder="- Chọn tên nhân viên -" style={{ width: "100%" }} onChange={handleSaleChange}>
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
          placeholder="- Chọn -"
          onChange={handleSourceOfGoodChange}
        />
      </Col>
      <Col span={4}>
        <Button type="primary" onClick={onSearch}>
          Lọc
        </Button>
        <Button
          type="primary"
          onClick={() => handleReset()}
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
