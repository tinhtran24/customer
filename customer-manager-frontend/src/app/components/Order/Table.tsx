"use client";
import React, { useState, useEffect } from "react";
import { Table, TableColumnsType } from "antd";
import OrderFilter from "./OrderFilter";
import moment, { Moment } from "moment";
import { fetchCustomerDashboard } from "@/app/lib/actions";
import Loading from "@/app/dashboard/loading";
import {
  Customer,
  CustomerProduct,
  CustomerProductItem,
  User,
} from "@/app/lib/definitions";

export interface FilterValues {
  from: Date | null;
  to: Date | null;
  customerName?: string;
  sale?: string;
  source?: string;
}

const TableOrder: React.FC = () => {
  const initFilter = {
    from: null,
    to: null,
    customerName: "",
    source: "",
    sale: "",
  };
  const [filteredData, setFilteredData] = useState<CustomerProduct[]>([]);
  const [filters, setFilters] = useState<FilterValues>(initFilter);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  const getData = async () => {
    setIsLoading(true);

    const data = await fetchCustomerDashboard(
      filters.customerName || null,
      filters.sale || null,
      filters.source || null,
      filters.from ? moment(filters.from).startOf('day').format("YYYY-MM-DD HH:mm:ss") : null,
      filters.to ? moment(filters.to).endOf('day').format("YYYY-MM-DD HH:mm:ss") : null
    );

    setFilteredData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleFilter = (newFilters: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleReset = () => {
    // router.refresh();
    window.location.reload();
  };

  const toggleExpand = (key: React.Key) => {
    if (expandedRowKeys.includes(key)) {
      setExpandedRowKeys(expandedRowKeys.filter((k) => k !== key));
    } else {
      setExpandedRowKeys([...expandedRowKeys, key]);
    }
  };

  const expandedRowRender = (record: CustomerProduct) => {
    const miniTableColumns: TableColumnsType<any> = [
      {
        title: "Tên sản phẩm",
        key: "productName",
        render: (_: any, s: CustomerProductItem) => s.product?.title,
      },
      {
        title: "Đơn giá",
        dataIndex: "unitPrice",
        key: "unitPrice",
        render: (s: number) => formatPrice(s),
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
      },
    ];

    return (
      <Table
        columns={miniTableColumns}
        dataSource={record.customerProductItems}
        pagination={false}
        rowKey="id"
      />
    );
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (customer: Customer) => customer.fullName,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (s: number) => formatPrice(s),
    },
    {
      title: "PT Giao hàng",
      dataIndex: "shipMethod",
      key: "shipMethod",
    },
    {
      title: "PT Thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    // {
    //   title: "Địa chỉ",
    //   dataIndex: "street",
    //   key: "street",
    // },
    {
      title: "Người tạo",
      dataIndex: "createdUser",
      key: "createdUser",
      render: (user: User) => user.name,
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
      <OrderFilter
        onFilter={handleFilter}
        onSearch={getData}
        handleReset={handleReset}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          rowKey="id"
          expandedRowKeys={expandedRowKeys}
          onExpand={(expanded, record) => toggleExpand(record.id)}
          expandable={{
            expandedRowRender,
          }}
        />
      )}
    </div>
  );
};

export default TableOrder;
