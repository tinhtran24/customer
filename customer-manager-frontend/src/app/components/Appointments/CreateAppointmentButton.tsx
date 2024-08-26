"use client";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Space, Spin } from "antd";
import React, { Suspense, useEffect, useState } from "react";
import { AddAppointmentModal } from "./CreateModal";
import { fetchCustomers, fetchUsers } from "@/app/lib/actions";
import { Customer, Pagination, User } from "@/app/lib/definitions";

interface CreateAppointmentProps {
  refresh: any;
}
export function CreateAppointment({ refresh }: CreateAppointmentProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [users, setUsers] = useState<User[] | null>(null);
  const [customersData, setCustomersData] =
    useState<Pagination<Customer> | null>(null);

  const getData = async () => {
    const [users, customers] = await Promise.all([
      fetchUsers(),
      fetchCustomers({
        page: "1",
        limit: "9999999999",
        q: "",
      }),
    ]);

    setUsers(users);
    setCustomersData(customers);
  };

  useEffect(() => {
    if (!users || !customersData) getData();
  }, []);

  if (!users || !customersData) return <Spin size="large" />;

  return (
    <>
      <Flex align="flex-end">
        <Space size={"middle"}>
          <Button type="primary" onClick={() => setShowCreate(true)}>
            <span style={{ marginRight: 10 }}>Tạo mới</span>
            <PlusOutlined />
          </Button>
        </Space>
      </Flex>
      {users && customersData && (
        <Suspense fallback={<Spin size="large" />}>
          <AddAppointmentModal
            visible={showCreate}
            users={users}
            customers={customersData?.items}
            onClose={() => {
              setShowCreate(false);
            }}
            refresh={refresh}
          />
        </Suspense>
      )}
    </>
  );
}
