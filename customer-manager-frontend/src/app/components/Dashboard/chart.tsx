"use client";
import React, { useEffect, useState } from "react";
import { Select, DatePicker, Row, Col, Card, Button } from "antd";
import { Column } from "@ant-design/charts";
import dayjs, { Dayjs } from "dayjs";
import { SettingSelect } from "../Common/Select";
import { SETTINGS_TYPE, User } from "@/app/lib/definitions";
import { fetchUsers } from "@/app/lib/actions";

const { Option } = Select;
const { RangePicker } = DatePicker;

const StatisticsChart: React.FC = () => {
  const [filterType, setFilterType] = useState<string | null>("year");
  const [year, setYear] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const getUsers = async () => {
    setIsLoadingUsers(true);
    const results = await fetchUsers();
    setUsers(results);
    setIsLoadingUsers(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const data = [
    { type: "Jan", value: 30 },
    { type: "Feb", value: 25 },
    { type: "Mar", value: 20 },
    { type: "Apr", value: 35 },
    { type: "May", value: 40 },
  ];

  const config = {
    data,
    xField: "type",
    yField: "value",
    label: {
      position: "middle",
      style: { fill: "#FFFFFF", opacity: 0.6 },
    },
    xAxis: { label: { autoHide: true, autoRotate: false } },
    meta: {
      type: { alias: "Month" },
      value: { alias: "Sales" },
    },
  };

  const handleFilterTypeChange = (value: string) => {
    setFilterType(value);
    setYear(null);
    setDateRange(null);
  };

  const handleYearChange = (value: string) => setYear(value);

  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    if (dates && dates[0] && dates[1]) {
      const start = dayjs(dates[0]).startOf('month');
      const end = dayjs(dates[1]).endOf('month');
      setDateRange([start, end]);
    } else {
      setDateRange(dates);
    }
  };

  return (
    <Card>
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={5}>
          <Select
            placeholder="Select Type"
            value={filterType}
            onChange={handleFilterTypeChange}
            style={{ width: "100%" }}
          >
            <Option value="year">Năm</Option>
            <Option value="month">Tháng</Option>
          </Select>
        </Col>

        {filterType === "year" && (
          <Col span={5}>
            <Select
              placeholder=" - Chọn năm -"
              onChange={handleYearChange}
              style={{ width: "100%" }}
            >
              <Option value="2024">2024</Option>
              <Option value="2025">2025</Option>
              <Option value="2026">2026</Option>
              <Option value="2026">2027</Option>
              <Option value="2026">2028</Option>
            </Select>
          </Col>
        )}

        {filterType === "month" && (
          <Col span={5}>
            <RangePicker
              placeholder={["Từ tháng", "Đến tháng"]}
              format="YYYY-MM"
              onChange={handleDateRangeChange}
              value={dateRange as [Dayjs, Dayjs] | null}
              picker="month"
            />
          </Col>
        )}

        <Col span={5}>
          <Select
            placeholder="- Chọn tên nhân viên -"
            style={{ width: "100%" }}
            allowClear
            loading={isLoadingUsers}
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
            placeholder="- Chọn kho -"
            type={SETTINGS_TYPE.SOURCE_OF_GOODS}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={() => {}}>
            Xem
          </Button>
        </Col>
      </Row>

      <Column {...config} />
    </Card>
  );
};

export default StatisticsChart;
