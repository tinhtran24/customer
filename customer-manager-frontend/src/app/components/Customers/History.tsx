"use client";
import {
  Customer,
  CustomerProduct,
  CustomerProductItem,
  Product,
  User,
} from "@/app/lib/definitions";
import { Table, Spin, TableColumnsType, Modal, message, Space } from "antd";
import React, { useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import OrderProduct, { OrderData, PaymentInformation } from "./Order";
import { deleteOrder, fetchCustomerProducts } from "@/app/lib/actions";
import Loading from "@/app/dashboard/loading";
import { MdDeleteOutline } from "react-icons/md";
import { useAuthContext } from "../auth";

const cssButton: React.CSSProperties = {
  cursor: "pointer",
  color: "green",
};

export function History({
  products,
  customer,
  provinces,
}: {
  products: Product[];
  customer: Customer;
  provinces: any[];
}) {
  const [customerProducts, setCustomerProducts] = useState<CustomerProduct[]>();
  const [isLoading, setIsLoading] = useState(false);

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  //update
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<{
    id: string;
    products: OrderData[];
    paymentInformation: PaymentInformation;
  }>();
  const { currentUser } = useAuthContext();
  const isAdmin = currentUser?.role === "admin";
  
  const getData = async () => {
    setIsLoading(true);
    setCustomerProducts(await fetchCustomerProducts(customer.id));
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    message.info("Đang xóa ...");
    try {
      const results = await deleteOrder(id);
      if (results.id) {
        message.success("Đã xóa thông tin thành công");
      } else message.error("Vui lòng thử lại sau");
    } catch (e) {}
  };

  const showDeleteConfirm = (s: CustomerProduct) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa thông tin này?",
      content: `${s.code}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        handleDelete(s.id);
        window.location.reload();
      },
    });
  };

  useEffect(() => {
    getData();
  }, [customer]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const toggleExpand = (key: React.Key) => {
    if (expandedRowKeys.includes(key)) {
      setExpandedRowKeys(expandedRowKeys.filter((k) => k !== key));
    } else {
      setExpandedRowKeys([...expandedRowKeys, key]);
    }
  };

  const openModal = (s: CustomerProduct) => {
    const products: OrderData[] = s.customerProductItems.map((i, index) => ({
      no: index + 1,
      product: i.product,
      price: i.unitPrice,
      quantity: i.quantity,
      code: i.product.code,
      totalPrice: i.quantity * i.unitPrice,
      source: i.source || "",
    }));
    const info: PaymentInformation = {
      code: s.code || "",
      street: s.street,
      price: s.price,
      PaymentMethod: s.paymentMethod,
      ShipMethod: s.shipMethod,
    };

    setVisible(true);
    setSelected((prevState) => ({
      ...prevState,
      id: s.id,
      products: products,
      paymentInformation: info,
    }));
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
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
        return <div style={{ textAlign: "left" }}>{formattedDate}</div>;
      },
    },
    {
      title: "",
      key: "edit",
      render: (s: any) => (
          <Space size="middle">
            <FiEdit3 onClick={() => openModal(s)} size={20} style={cssButton} />
            {isAdmin && (
              <MdDeleteOutline
                onClick={() => showDeleteConfirm(s)}
                size={20}
                style={{
                  color: "red",
                  cursor: "pointer",
                }}
            />
            )}
          </Space>
      ),
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

  if (isLoading || !customerProducts) return <Loading />;

  return (
    <>
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
      <Modal
        visible={visible}
        title="Cập nhật"
        onCancel={() => {
          setVisible(false);
          setSelected(undefined);
        }}
        width={"80%"}
        footer={[]}
      >
        <OrderProduct
          products={products}
          customer={customer}
          provinces={provinces}
          initData={selected}
          refetch={() => {
            getData();
            setVisible(false);
          }}
        />
      </Modal>
    </>
  );
}
