"use client";
import React, { useEffect, useState } from "react";
import { Select, DatePicker, Row, Col, Card, Button } from "antd";
import { Column } from "@ant-design/charts";
import dayjs, { Dayjs } from "dayjs";
import { SettingSelect } from "../Common/Select";
import { SETTINGS_TYPE, User } from "@/app/lib/definitions";
import { fetchUsers, getDataChart } from "@/app/lib/actions";
import {
  FilterValuesDashboard,
  ParamsResetDashboard,
} from "./dashboard.interface";
import moment from "moment";
import { LabelFilterDashboard } from "./LabelFilter";
import Loading from "@/app/dashboard/loading";
import { useAuthContext } from "../auth";

const { Option } = Select;
const { RangePicker } = DatePicker;

const initFilter = {
  from: null,
  to: null,
  year: new Date().getFullYear(),
  source: null,
  sale: null,
};

const StatisticsChart: React.FC = () => {
  const [filterType, setFilterType] = useState<string | null>("year");

  const [filters, setFilters] = useState<FilterValuesDashboard>(initFilter);
  const [filteredValues, setFilteredValues] =
    useState<FilterValuesDashboard>(initFilter);

  const [users, setUsers] = useState<User[]>([]);
  const [data, setData] = useState<{ key: number; value: string }[]>([]);

  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuthContext();
  const isAdmin = currentUser?.role === "admin";
  
  const getUsers = async () => {
    setIsLoadingUsers(true);
    const results = await fetchUsers();
    setUsers(results);
    setIsLoadingUsers(false);
  };

  const getData = async (params?: ParamsResetDashboard) => {
    const sale = params?.isSaleNull ? null : filters.sale;
    const source = params?.isSourceNull ? null : filters.source;
    const from =
      params?.isDateNull !== true && filters.from
        ? moment(filters.from).startOf("day").format("YYYY-MM-DD HH:mm:ss")
        : null;
    const to =
      params?.isDateNull !== true && filters.to
        ? moment(filters.to).endOf("day").format("YYYY-MM-DD HH:mm:ss")
        : null;
    const year =
      params?.isDateNull !== true && filters.year
        ? filters.year.toString()
        : null;

    setFilters({
      sale: sale,
      source: source,
      from: from ? new Date(from) : null,
      to: to ? new Date(to) : null,
      year: year ? Number(year) : null,
    });
    setFilteredValues({
      sale: sale,
      source: source,
      from: from ? new Date(from) : null,
      to: to ? new Date(to) : null,
      year: year ? Number(year) : null,
    });

    setIsLoading(true);
    const data = await getDataChart({
      sale: sale,
      source: source,
      from: from,
      to: to,
      year: year,
    });
    setData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getUsers();
    getData();
  }, []);

  const transformedData = data?.map((item) => ({
    ...item,
    key: item.key?.toString(),
    value: parseFloat(item.value),
  }));

  const config = {
    data: transformedData,
    xField: "key",
    yField: "value",
    label: {
      position: "middle",
      style: { fill: "#FFFFFF", opacity: 0.6 },
      formatter: (v: number) => `₫${v.toLocaleString("vi-VN")}`,
    },
    meta: {
      type: { alias: "Type" },
      value: { alias: "Value" },
    },
  };

  const handleFilter = (newFilters: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const handleFilterTypeChange = (value: string) => {
    setFilterType(value);
    handleFilter({ from: null, to: null, year: null });
  };

  const handleYearChange = (value: string) => handleFilter({ year: value });

  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    if (dates && dates[0] && dates[1]) {
      const start = dates[0].startOf("month").toDate();
      const end = dates[1].endOf("month").toDate();

      handleFilter({
        from: start,
        to: end,
      });
    }
  };

  const handleSaleChange = (value: string | null) => {
    handleFilter({ sale: value });
  };

  const handleSourceChange = (value: string | null) => {
    handleFilter({ source: value });
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
              value={filters.year?.toString()}
              style={{ width: "100%" }}
            >
              <Option value="2024">2024</Option>
              <Option value="2025">2025</Option>
              <Option value="2026">2026</Option>
              <Option value="2027">2027</Option>
              <Option value="2028">2028</Option>
            </Select>
          </Col>
        )}

        {filterType === "month" && (
          <Col span={5}>
            <RangePicker
              placeholder={["Từ tháng", "Đến tháng"]}
              format="YYYY-MM"
              onChange={handleDateRangeChange}
              value={
                filters.from && filters.to
                  ? [dayjs(filters.from), dayjs(filters.to)]
                  : null
              }
              picker="month"
            />
          </Col>
        )}
        {isAdmin && (
          <>
            <Col span={5}>
              <Select
                placeholder="- Chọn tên nhân viên -"
                style={{ width: "100%" }}
                allowClear
                loading={isLoadingUsers}
                value={filters.sale}
                onChange={handleSaleChange}
              >
                {Array.isArray(users) && users.map((user) => (
                  <Option key={user.id} value={user.name}>
                    {`${user.name} - ${user.email}`}
                  </Option>
                ))}
              </Select>
            </Col>
          </>
        )
        }
      

        <Col span={5}>
          <SettingSelect
            placeholder="- Chọn kho -"
            type={SETTINGS_TYPE.SOURCE_OF_GOODS}
            style={{ width: "100%" }}
            value={filters.source}
            onChange={handleSourceChange}
          />
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={() => getData()}>
            Xem
          </Button>
        </Col>
      </Row>
      {!isLoading && (
        <LabelFilterDashboard
          filteredValue={filteredValues}
          handleFilterReset={getData}
        />
      )}
      {isLoading ? (
        <Loading />
      ) : transformedData?.length === 0 ? (
        <h4
          style={{ margin: "6rem 0", textAlign: "center", fontStyle: "italic" }}
        >
          Không có dữ liệu
        </h4>
      ) : (
        <Column {...config} />
      )}
    </Card>
  );
};

export default StatisticsChart;
