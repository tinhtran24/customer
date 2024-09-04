import React from "react";
import {
  DatePicker,
  Input,
  Select,
  Button,
  Row,
  Col,
} from "antd";
import moment, { Moment } from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface FilterValues {
  dateRange?: [Moment, Moment];
  customerName?: string;
  sale?: string;
  warehouse?: string;
}

interface OrderFilterProps {
  onFilter: (filters: FilterValues) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({ onFilter }) => {
  const handleDateChange = (dates: [Moment, Moment] | null) => {
    onFilter({
      dateRange: dates || [moment(), moment()],
    });
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

  const handleWarehouseChange = (value: string) => {
    onFilter({
      warehouse: value,
    });
  };

  const handleApplyFilter = () => {};

  return (
    <Row gutter={[16, 16]} style={{ margin: "1rem 0 2rem 0" }}>
      <Col span={5}>
        <RangePicker
          onChange={() => handleDateChange}
          style={{ width: "100%" }}
        />
      </Col>
      <Col span={5}>
        <Input
          placeholder="Tên khách hàng"
          onChange={handleCustomerNameChange}
        />
      </Col>
      <Col span={5}>
        <Select
          placeholder="Sale"
          style={{ width: "100%" }}
          onChange={handleSaleChange}
        >
          <Option value="sale1">Sale 1</Option>
          <Option value="sale2">Sale 2</Option>
          <Option value="sale3">Sale 3</Option>
        </Select>
      </Col>
      <Col span={5}>
        <Select
          placeholder="Kho"
          style={{ width: "100%" }}
          onChange={handleWarehouseChange}
        >
          <Option value="Kho 1">Kho 1</Option>
          <Option value="K2">Kho 2</Option>
          <Option value="K3">Kho 3</Option>
        </Select>
      </Col>
      <Col span={4}>
        <Button
          type="primary"
          onClick={handleApplyFilter}
        >
          Lọc
        </Button>
        <Button
          type="primary"
          onClick={() => {}}
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
