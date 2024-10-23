"use client";
import React, { useEffect, useState } from "react";
import { Input, Button, Select, DatePicker, Col, message } from "antd";
import { SettingSelect } from "../Common/Select";
import { SETTINGS_TYPE, User } from "@/app/lib/definitions";
import { FilterCustomer } from "./customer.interface";
import { CustomerFilterKey, removeFilterCustomer } from "./LabelFilter";
import { Dayjs } from "dayjs";
import { fetchUsers } from "@/app/lib/actions";
import { useAuthContext } from "../auth";

const { RangePicker } = DatePicker;

interface SearchProps {
  text: string;
  status: string;
  date: [Dayjs | null, Dayjs | null];
  userInCharge: string;
  onChangeText: (text: string) => void;
  onChangeStatus: (status: string) => void;
  handleDateChange: (dates: [Dayjs | null, Dayjs | null] | null) => void;
  onChangeUserInCharge: (status: string) => void;
  handleFilter: () => void;
  handleResetFiltersAll: any;
  handleFilterReset: (params: FilterCustomer) => void;
}

const { Option } = Select;

const SearchCustomers = ({
  text,
  status,
  date,
  userInCharge,
  onChangeText,
  onChangeStatus,
  handleDateChange,
  onChangeUserInCharge,
  handleFilter,
  handleResetFiltersAll,
  handleFilterReset,
}: SearchProps) => {
  const { currentUser } = useAuthContext();
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

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Col span={5}>
          <Input
            value={text}
            placeholder="Tên khách hàng, số điện thoại, email"
            allowClear
            size="large"
            onChange={(e) => {
              onChangeText(e.target.value);
              if (e.target.value === "")
                removeFilterCustomer(
                  handleFilterReset,
                  CustomerFilterKey.SEARCH_TEXT
                );
            }}
            style={{ height: "35px", fontSize: 14 }}
          />
        </Col>
        <Col span={5}>
          <SettingSelect
            value={status || null}
            placeholder="- Chọn trạng thái -"
            onChange={(e: string) => onChangeStatus(e)}
            style={{ width: "100%", height: "35px" }}
            type={SETTINGS_TYPE.STATUS}
            allowClear
            onClear={() =>
              removeFilterCustomer(handleFilterReset, CustomerFilterKey.STATUS)
            }
          />
        </Col>
        {currentUser?.role === "admin" && (
          <Col span={5}>
            <Select
              placeholder="- Chọn tên nhân viên -"
              style={{ width: "100%", height: "35px" }}
              onChange={onChangeUserInCharge}
              value={userInCharge || undefined}
              allowClear
              onClear={() =>
                removeFilterCustomer(
                  handleFilterReset,
                  CustomerFilterKey.USER_IN_CHARGE
                )
              }
              loading={isLoadingUsers}
            >
              {Array.isArray(users) &&
                users.map((user) => (
                  <Option key={user.id} value={`${user.id}@${user.name}`}>
                    {`${user.name} - ${user.email}`}
                  </Option>
                ))}
            </Select>
          </Col>
        )}
        <Col span={5}>
          <RangePicker
            onChange={handleDateChange}
            style={{ height: "35px" }}
            value={date[0] !== null ? date : null}
            placeholder={["Từ ngày", "Đến ngày"]}
          />
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            onClick={handleFilter}
            style={{ height: "35px" }}
          >
            Lọc
          </Button>
          <Button
            type="primary"
            onClick={handleResetFiltersAll}
            style={{
              height: "35px",
              background: "white",
              border: "1px solid blue",
              color: "blue",
              marginLeft: 8,
            }}
          >
            Bỏ lọc
          </Button>
        </Col>
      </div>
    </div>
  );
};

export default SearchCustomers;
