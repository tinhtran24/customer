"use client";
import { Task } from "@/app/lib/definitions";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

const columns: ColumnsType<Task> = [
  {
    title: "Mã số",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "Mã công việc",
    dataIndex: "label",
    key: "label",
  },
  {
    title: "Chi tiết",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Ngày hẹn",
    dataIndex: "date",
    key: "date",
    render: (date: string) => new Date(date).toLocaleString(),
  },
  {
    title: "Người phụ trách",
    dataIndex: ["userInCharge", "name"],
    key: "userInCharge",
  }
];

interface TaskTableProps {
  tasks: Task[];
}
export default function TaskTable({ tasks }: TaskTableProps) {
  return (
    <Table
      dataSource={tasks}
      columns={columns}
      rowKey={(record) => record.id}
    />
  );
}
