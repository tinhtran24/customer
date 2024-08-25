"use client";
import { NewProduct, Product } from "@/app/lib/definitions";
import { Table, Tooltip, theme, message, Modal } from "antd";
import { useEffect, useState } from "react";
import type { TableColumnsType } from "antd";
import { UpdateProductModal } from "./UpdateModal";
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { deleteProduct, updateProduct } from "@/app/lib/actions";
import router from "next/router";

export default function ProductTable({ products }: { products: Product[] }) {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  //#region hook
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleOpenUpdateModal = (product: Product) => {
    setSelectedProduct(product);
    setIsUpdateModalVisible(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setSelectedProduct(null);
  };

  const handleUpdateProduct = async (values: NewProduct) => {
    try {
      const results = await updateProduct(selectedProduct?.id || "", values);
      if (results.id) {
        message.success("Đã sửa sản phẩm thành công");
        router.push("/dashboard/products");
        //set curent page = 1
      } else message.error("Vui lòng thử lại sau");
    } catch (e) {}
    handleCloseUpdateModal();
  };

  const handleDeleteProduct = async (id: string) => {
    message.info("Đang xóa ...");
    try {
      const results = await deleteProduct(id);
      if (results.id) {
        message.success("Đã xóa sản phẩm thành công");
        router.push("/dashboard/products");
      } else message.error("Vui lòng thử lại sau");
    } catch (e) {}
  };

  const showDeleteConfirm = (product: Product) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      content: `${product.title}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        handleDeleteProduct(product.id);
      },
    });
  };

  useEffect(() => {
    if (!products) setIsLoading(true);
  }, [products]);
  //#endregion

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const columns: TableColumnsType<Product> = [
    {
      title: "#",
      dataIndex: "id",
      width: "10%",
      render: (id: string) => id.slice(0, 8),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "title",
      width: "20%",
      render: (value: string) => (
        <Tooltip title={value}>
          {value.length > 30 ? `${value.slice(0, 30)}...` : value}
        </Tooltip>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: "25%",
      render: (value: string) => (
        <Tooltip title={value}>
          {value.length > 30 ? `${value.slice(0, 30)}...` : value}
        </Tooltip>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      width: "15%",
      render: (price) => formatPrice(price),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: "10%",
      render: (created_at: string) => {
        const date = new Date(created_at);
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
        return <div style={{ textAlign: "left" }}>{formattedDate}</div>;
      },
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      width: "10%",
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
      width: "5%",
      render: (product) => (
        <FiEdit3
          onClick={() => handleOpenUpdateModal(product)}
          size={25}
          style={{
            color: "green",
            cursor: "pointer",
          }}
        />
      ),
    },
    {
      title: "",
      width: "5%",
      render: (product) => (
        <MdDeleteOutline
          onClick={() => showDeleteConfirm(product)}
          size={25}
          style={{
            color: "red",
            cursor: "pointer",
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Table
        loading={isLoading}
        pagination={{ pageSize: 15 }}
        locale={{
          emptyText: "Không tìm thấy sản phẩm",
        }}
        columns={columns}
        dataSource={products}
      />
      {selectedProduct && (
        <UpdateProductModal
          visible={isUpdateModalVisible}
          onClose={handleCloseUpdateModal}
          onUpdateProduct={handleUpdateProduct}
          initialValues={selectedProduct}
        />
      )}
    </>
  );
}
