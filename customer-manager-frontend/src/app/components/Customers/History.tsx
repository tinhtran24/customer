"use client";
import { CustomerProduct, User } from "@/app/lib/definitions";
import { Table, Spin, TableColumnsType } from "antd";

export async function History({
  customerProducts,
}: {
  customerProducts: CustomerProduct[];
}) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const columns: TableColumnsType<CustomerProduct> = [
    // {
    //   title: "Tên sản phẩm",
    //   key: "productName",
    //   render: (_: any, s: CustomerProduct) => s.product.title,
    // },
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
      title: "Created By",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (updated_at: string) => {
        const date = new Date(updated_at);
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
        return <div style={{ textAlign: "left" }}>{formattedDate}</div>;
      },
    },
  ];

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

  return <Table columns={columns} dataSource={customerProducts} rowKey="id" />;
}
