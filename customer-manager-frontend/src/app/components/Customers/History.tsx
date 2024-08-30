"use client";
import { CustomerProduct, CustomerProductItem, User } from "@/app/lib/definitions";
import { Table, Spin, TableColumnsType, Button } from "antd";
import { useState } from "react";

export function History({
  customerProducts,
}: {
  customerProducts: CustomerProduct[];
}) {
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  console.log(customerProducts)
  const toggleExpand = (key: React.Key) => {
    if (expandedRowKeys.includes(key)) {
      setExpandedRowKeys(expandedRowKeys.filter((k) => k !== key));
    } else {
      setExpandedRowKeys([...expandedRowKeys, key]);
    }
  };

  const columns: TableColumnsType<CustomerProduct> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (s: number) => formatPrice(s),
    },
    {
      title: "PT thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "PT giao hàng",
      dataIndex: "shipMethod",
      key: "shipMethod",
    },
    {
      title: "Người tạo",
      dataIndex: "createdUser",
      key: "createdUser",
      render: (s: User) => s.name,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (updated_at: string) => {
        const date = new Date(updated_at);
        const formattedDate = `${date.getDate()
          .toString()
          .padStart(2, "0")}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
        return <div style={{ textAlign: "left" }}>{formattedDate}</div>;
      },
    },
  ];

  const expandedRowRender = (record: CustomerProduct) => {
    const miniTableColumns: TableColumnsType<any> = [
      {
        title: "Tên sản phẩm",
        key: "productName",
        render: (_: any, s: CustomerProductItem) => s.product.title,
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

  if (!customerProducts)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "5rem 0",
        }}
      >
        <Spin size="large" />
      </div>
    );

  return (
    <Table
      columns={columns}
      dataSource={customerProducts}
      rowKey="id"
      expandedRowKeys={expandedRowKeys}
      onExpand={(expanded, record) => toggleExpand(record.id)}
      expandable={{
        expandedRowRender,
      }}
    />
  );
}
