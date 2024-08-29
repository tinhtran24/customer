// "use client";
import { Appointment, Customer, Pagination, User } from "@/app/lib/definitions";
import { Table, Tooltip, theme, message, Modal, Spin } from "antd";
import { Suspense, useEffect, useState } from "react";
import type { TableColumnsType } from "antd";
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import {
  deleteAppointment,
  fetchCustomers,
  fetchUsers,
  updateAppointment,
} from "@/app/lib/actions";
import router from "next/router";
import Loading from "@/app/dashboard/loading";
import { UpdateAppointmentModal } from "./UpdateModal";

interface AppointmentTableProps {
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  setIsLoading: any;
  appointmentsData: Pagination<Appointment> | null;
  changePage: any;
}
export default async function AppointmentTable({
  currentPage,
  pageSize,
  isLoading,
  setIsLoading,
  appointmentsData,
  changePage,
}: AppointmentTableProps) {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const handleDeleteAppointment = async (id: string) => {
    message.info("Đang xóa ...");
    try {
      const results = await deleteAppointment(id);
      if (results.id) {
        message.success("Đã xóa sản phẩm thành công");
        changePage({ current: 1 });
      } else message.error("Vui lòng thử lại sau");
    } catch (e) {}
  };

  const showDeleteConfirm = (product: Appointment) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      content: `${product.id}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        handleDeleteAppointment(product.id);
      },
    });
  };

  useEffect(() => {
    if (!appointmentsData) setIsLoading(true);
  }, [appointmentsData]);
  //#endregion

  const columns: TableColumnsType<Appointment> = [
    {
      title: "#",
      dataIndex: "id",
      width: "10%",
      render: (id: string) => id.slice(0, 8),
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      width: "20%",
      render: (customer: Customer) => (
        <Tooltip title={customer.fullName}>
          {customer.fullName.length > 30
            ? `${customer.fullName.slice(0, 30)}...`
            : customer.fullName}
        </Tooltip>
      ),
    },
    // {
    //   title: "Người phụ trách",
    //   dataIndex: "userInCharge",
    //   width: "20%",
    //   render: (userInCharge: User) => (
    //     <Tooltip title={userInCharge.name}>
    //       {userInCharge.name.length > 30
    //         ? `${userInCharge.name.slice(0, 30)}...`
    //         : userInCharge.name}
    //     </Tooltip>
    //   ),
    // },
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
    // {
    //   title: "",
    //   width: "5%",
    //   render: (product) => (
    //     <FiEdit3
    //       onClick={() => handleOpenUpdateModal(product)}
    //       size={25}
    //       style={{
    //         color: "green",
    //         cursor: "pointer",
    //       }}
    //     />
    //   ),
    // },
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
      {isLoading || !appointmentsData ? (
        <Loading />
      ) : (
        <Table
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: appointmentsData?.meta?.totalItems || 0,
            showSizeChanger: false,
          }}
          locale={{
            emptyText: "Không tìm thấy lịch hẹn",
          }}
          columns={columns}
          dataSource={appointmentsData.items}
          onChange={changePage}
        />
      )}
      {/* {selected && (
        <UpdateAppointmentModal
          visible={isUpdateModalVisible}
          onClose={handleCloseUpdateModal}
          onUpdateAppointment={handleUpdateAppointment}
          initialValues={selected}
          refreshPage={() => changePage({ current: 1 })}
          customers={customersData?.items || []}
          users={users || []}
        />
      )} */}
    </>
  );
}
