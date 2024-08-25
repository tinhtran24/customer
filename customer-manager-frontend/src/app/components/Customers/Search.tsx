// components/SearchComponent.js
"use client";
import { Input } from "antd";

interface SearchProps {
  text: string;
  onChange: any;
  handleSearch: any;
}
const SearchCustomers = ({ text, onChange, handleSearch }: SearchProps) => {
  return (
    <div style={{ maxWidth: "500px" }}>
      <Input.Search
        value={text}
        placeholder="Tên khách hàng, số điện thoại, email"
        allowClear
        enterButton
        size="large"
        onSearch={handleSearch}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchCustomers;
