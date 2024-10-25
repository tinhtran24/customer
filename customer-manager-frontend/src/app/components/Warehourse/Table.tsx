"use client";
import Loading from "@/app/dashboard/loading";
import { fetchWareHouse, productWarehouse, updateWareHouse } from "@/app/lib/actions";
import { ProductWarehouse, ProductWarehouses } from "@/app/lib/definitions";
import {
  Button,
  Table,
  TableColumnsType,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { ImportOutlined } from "@ant-design/icons";
import './style.css'
import dayjs from 'dayjs';

// use to display
type WarehouseUpdate = {
  productId: string;
  quantityInStock: number;
  quantityInUse: number;
  source: string;
  price: number;
  productName: string;
};

type ProductCustom = {
  id: string;
  title: string;
  code: string;
  description: string;
  price: number;
  quantityInStock: number;
  quantityInUse: number;
  displayQuantity: number;
  createdAt: string;
};

type GroupItem = {
  id: string;
  source: string;
  totalProducts: number;
  products: ProductCustom[];
};

export default function WarehourseTable() {
  const [warehouse, setWarehouse] = useState<ProductWarehouses[]>();
  const [selectedItem, setSelectedItem] = useState<WarehouseUpdate>();
  const [isLoading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const [formModal] = Form.useForm();

  const getData = async () => {
    setLoading(true);
    const data = await fetchWareHouse();
    setWarehouse(data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const groupedData: GroupItem[] =
    warehouse?.reduce((acc: GroupItem[], current: ProductWarehouses) => {
      const existingItemIndex = acc.findIndex(
        (item) => item.source === current.source
      );

      const product: ProductCustom = {
        id: current.product?.id || "",
        title: current.product?.title || "",
        code: current.product?.code || "",
        description: current.product?.description || "",
        price: current.product?.price || 0,
        quantityInStock: current.quantityInStock,
        quantityInUse: current.quantityInUse,
        displayQuantity: current.displayQuantity,
        createdAt: current.product?.updatedAt || "",
      };

      if (existingItemIndex >= 0) {
        acc[existingItemIndex].products.push(product);
        acc[existingItemIndex].totalProducts =
          acc[existingItemIndex].products.length;
      } else {
        acc.push({
          id: current.id,
          source: current.source,
          totalProducts: 1,
          products: [product],
        });
      }

      return acc;
    }, []) || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleOnClickEdit = (
    record: GroupItem,
    productSelected: ProductCustom
  ) => {
    setSelectedItem({
      productId: productSelected.id,
      source: record.source,
      price: productSelected.price,
      quantityInStock: productSelected.quantityInStock,
      quantityInUse: productSelected.quantityInUse,
      productName: productSelected.title,
    });

    setVisibleModal(true);
  };

  const expandedRowRender = (record: GroupItem) => {
    const miniTableColumns: TableColumnsType<ProductCustom> = [
      {
        title: "Tên sản phẩm",
        key: "productName",
        render: (_: any, s: ProductCustom) => s.title,
        width: "30%",
      },
      {
        title: "Đơn giá",
        dataIndex: "price",
        key: "price",
        render: (s: number) => formatPrice(s),
        width: "15%",
      },
      {
        title: "Đã nhập",
        dataIndex: "quantityInStock",
        key: "quantityInStock",
        width: "10%",
      },
      {
        title: "Đã bán",
        dataIndex: "quantityInUse",
        key: "quantityInUse",
        width: "10%",
      },
      {
        title: "Còn lại",
        dataIndex: "displayQuantity",
        key: "displayQuantity",
        width: "10%",
      },
      {
        title: "Ngày nhập",
        dataIndex: "createdAt",
        key: "createdAt",
        width: "15%",
        render: (dateStr) => dayjs(dateStr).format('DD/MM/YYYY HH:mm:ss'),
      },
      {
        title: "Nhập kho",
        key: "edit",
        render: (s: any) => {
          return (
            <ImportOutlined
              onClick={() => handleOnClickEdit(record, s)}
              size={20}
              style={{
                color: "blue",
                cursor: "pointer",
              }}
            />
          );
        },
        width: "10%",
      },
    ];

    return (
      <Table
        columns={miniTableColumns}
        dataSource={record.products}
        pagination={false}
        rowKey="id"
      />
    );
  };

  const handleUpdate = async (data: any) => {
    if (!selectedItem) return;
    setIsFormSubmitting(true);
    try {

      const body: ProductWarehouse = {
        productWarehouse: {
            source: selectedItem.source,
            quantityInStock: data.quantityInStock,
            quantityInUse: 0,
            price: data.price
          }
      };
      const result = await productWarehouse(selectedItem.productId, body);
    

      if (result.statusCode === 500) {
        message.error(
          Array.isArray(result.message) ? result.message[0] : result.message
        );
      } else {
        message.success("Cập nhật số lượng thành công");
        setVisibleModal(false);
        getData();
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra.");
    }

    setIsFormSubmitting(false);
  };

  const handleCancelModal = () => {
    setVisibleModal(false);
    setSelectedItem(undefined);
    formModal.resetFields();
  };

  const columns: ColumnsType<GroupItem> = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) => (
        <div style={{ textAlign: "left" }}>{index + 1}</div>
      ),
      width: "10%",
    },
    {
      title: "Kho",
      dataIndex: "source",
      key: "source",
      width: "60%",
    },
    {
      title: "Tổng sản phẩm",
      dataIndex: "totalProducts",
      key: "totalProducts",
      width: "30%",
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <>
      <Table
        dataSource={groupedData}
        columns={columns}
        rowKey={(record) => record.id}
        onRow={(record, rowIndex) => {
          return {
              className: 'custom-row',
          };
      }}
        expandable={{
          expandedRowRender,
        }}
      />
      {selectedItem && (
        <Modal
          key={selectedItem.productName + selectedItem.source}
          visible={visibleModal}
          title="Nhập hàng"
          onCancel={handleCancelModal}
          footer={[
            <Button key="back" onClick={handleCancelModal}>
              Thoát
            </Button>,
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              form="productForm"
              loading={isFormSubmitting}
            >
              Cập nhật
            </Button>,
          ]}
        >
          <Form
            id="productForm"
            form={formModal}
            layout="vertical"
            onFinish={handleUpdate}
          >
            <Form.Item>
              {
                <span>{`${selectedItem.productName} - ${selectedItem.source}`}</span>
              }
            </Form.Item>

            <Form.Item
              name="quantityInStock"
              label="Số lượng nhập"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng nhập!" },
              ]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              name="price"
              label="Giá (VNĐ)"
              rules={[
                { required: true, message: "Vui lòng nhập đơn giá" },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
}
