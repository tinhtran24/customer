"use client";
import {
  CreateSetting,
  Setting,
  SETTINGS_TYPE,
  UpdateSetting,
} from "@/app/lib/definitions";
import { Table, message, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FiEdit3 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { UpdateModal } from "./UpdateModal";
import { useState } from "react";
import { deleteSetting, updateSettings } from "@/app/lib/actions";

interface CommonTableProps {
  data: Setting[];
  type: SETTINGS_TYPE;
}

export default function CommonTable({ data, type }: CommonTableProps) {
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);

  const handleOpenUpdateModal = (s: Setting) => {
    setSelectedSetting(s);
    setVisibleUpdate(true);
  };

  const handleCloseUpdateModal = () => {
    setVisibleUpdate(false);
    setSelectedSetting(null);
  };

  const handleUpdate = async (values: UpdateSetting) => {
    try {
      const body: CreateSetting = {
        key: selectedSetting?.key || "",
        type: type,
        label: values.label,
      };
      const results = await updateSettings(selectedSetting?.id || "", body);
      if (results.id) {
        message.success("Đã sửa thông tin thành công");
      } else message.error("Vui lòng thử lại sau");
    } catch (e) {}
    handleCloseUpdateModal();
  };

  const handleDelete = async (id: string) => {
    message.info("Đang xóa ...");
    try {
      const results = await deleteSetting(id);
      if (results.id) {
        message.success("Đã xóa thông tin thành công");
      } else message.error("Vui lòng thử lại sau");
    } catch (e) {}
  };

  const showDeleteConfirm = (s: Setting) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa thông tin này?",
      content: `${s.label}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        handleDelete(s.id);
      },
    });
  };

  const columns: ColumnsType<Setting> = [
    {
      title: "#",
      width: "10%",
      dataIndex: "id",
      key: "id",
      render: (id: string) => id.substring(0, 8),
    },
    {
      title: "Tên",
      width: "40%",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Ngày tạo",
      width: "20%",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d: string) => {
        const date = new Date(d);
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
        return <div style={{ textAlign: "center" }}>{formattedDate}</div>;
      },
    },
    {
      title: "Ngày cập nhật",
      width: "20%",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (d: string) => {
        const date = new Date(d);
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
        return <div style={{ textAlign: "center" }}>{formattedDate}</div>;
      },
    },
    {
      title: "",
      width: "5%",
      render: (product) => (
        <FiEdit3
          onClick={() => handleOpenUpdateModal(product)}
          size={20}
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
      render: (s) => (
        <MdDeleteOutline
          onClick={() => showDeleteConfirm(s)}
          size={20}
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
        dataSource={data}
        columns={columns}
        rowKey={(record) => record.id}
      />
      {selectedSetting && (
        <UpdateModal
          visible={visibleUpdate}
          onClose={handleCloseUpdateModal}
          onUpdate={handleUpdate}
          initialValues={selectedSetting}
        />
      )}
    </>
  );
}
