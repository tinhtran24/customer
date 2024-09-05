"use client";
import React, { useState, useEffect } from "react";
import { Table } from "antd";
import OrderFilter from "./OrderFilter";
import moment, { Moment } from "moment";

interface OrderData {
  key: string;
  orderNumber: string;
  customerName: string;
  price: number;
  paymentMethod: string;
  deliveryMethod: string;
  createdBy: string;
  createdAt: string;
}

const TableOrder: React.FC = () => {
  const [filteredData, setFilteredData] = useState<OrderData[]>([]);
  const [filters, setFilters] = useState({
    dateRange: [moment().startOf("month"), moment().endOf("month")] as
      | [Moment, Moment]
      | null,
    customerName: "",
    paymentMethod: "",
    source: "",
    createdBy: "",
  });

  useEffect(() => {
    // get data -- update later
  }, [filters]);

  const handleFilter = (newFilters: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text: number) => <span>{text.toLocaleString()} VND</span>,
    },
    {
      title: "PT thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "PT giao hàng",
      dataIndex: "deliveryMethod",
      key: "deliveryMethod",
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => moment(text).format("YYYY-MM-DD"),
    },
  ];

  return (
    <div>
      <OrderFilter onFilter={handleFilter} />
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10 }}
        rowKey="key"
      />
    </div>
  );
};

export default TableOrder;
