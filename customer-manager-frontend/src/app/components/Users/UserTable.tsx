"use client";

import { User, UserDataType } from "@/app/lib/definitions";
import type { TableColumnsType } from "antd";
import { Table } from "antd";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function UserTable({ users }: { users: User[] }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!users) setIsLoading(true);
  }, [users]);

  const data: UserDataType[] = users.map((user: any) => ({
    key: `user-key-${user.id}`,
    userId: user.id,
    name: user.name,
    email: user.email,
  }));

  const columns: TableColumnsType<UserDataType> = [
    {
      title: "Tên người dùng",
      dataIndex: "name",
      render: (_: any, record: UserDataType) => (
        <Link href={`/dashboard/admin/users/${record.userId}`}>
          {record.name}
        </Link>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
  ];
  return (
    <Table
      loading={isLoading}
      pagination={{ pageSize: 8 }}
      locale={{
        emptyText: "Không tìm thấy người dùng",
      }}
      columns={columns}
      dataSource={data}
    />
  );
}
