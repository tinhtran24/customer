"use client";
import React from "react";
import { Input, Button, Select } from "antd";
import { SettingSelect } from "../Common/Select";
import { SETTINGS_TYPE } from "@/app/lib/definitions";

interface SearchProps {
  text: string;
  status: string;
  onChangeText: (text: string) => void;
  onChangeStatus: (status: string) => void;
  handleFilter: () => void;
  handleResetFilters: any;
}

const { Option } = Select;

const SearchCustomers = ({
  text,
  status,
  onChangeText,
  onChangeStatus,
  handleFilter,
  handleResetFilters
}: SearchProps) => {
  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Input
          value={text}
          placeholder="Tên khách hàng, số điện thoại, email"
          allowClear
          size="large"
          onChange={(e) => onChangeText(e.target.value)}
          style={{ width: "400px", height: "35px" }}
        />
        <SettingSelect
          value={status}
          placeholder="- Chọn -"
          onChange={(e: string) => onChangeStatus(e)}
          style={{ width: "300px", height: "35px" }}
          type={SETTINGS_TYPE.STATUS}
        >
        </SettingSelect>
        <Button
          type="primary"
          onClick={handleFilter}
          style={{ height: "35px" }}
        >
          Lọc
        </Button>
        <Button
          type="primary"
          onClick={handleResetFilters}
          style={{
            height: "35px",
            background: "white",
            border: "1px solid blue",
            color: "blue",
          }}
        >
          Bỏ lọc
        </Button>
      </div>
    </div>
  );
};

export default SearchCustomers;
