"use client";
import CustomerTable from "@/app/components/Customers/Table";
import { Flex, Divider, Spin } from "antd";
import { CreateCustomer } from "@/app/components/Customers/Button";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { shantell } from "@/app/utils/fontSetting";
import { useState } from "react";
import { Dayjs } from "dayjs";

export default function CustomerPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filteredValue, setFilteredValue] = useState({
    searchText: "",
    status: "",
    date: [null, null] as [Dayjs | null, Dayjs | null],
  });

  return (
    <main>
      <AntdRegistry>
        <Flex justify="space-between" gap="large" vertical>
          <Flex justify="space-between" align="flex-end">
            <h2
              className={shantell.className}
              style={{
                color: "#0d2f5f",
                alignItems: "end",
                padding: 0,
                margin: 0,
              }}
            >
              QUẢN LÝ KHÁCH HÀNG
            </h2>
            <CreateCustomer
              filteredValue={filteredValue}
              pageSize={pageSize}
              currentPage={currentPage}
            />
          </Flex>

          <Divider style={{ margin: 0 }} />
          <CustomerTable
            filteredValue={filteredValue}
            setFilteredValue={setFilteredValue}
            pageSize={pageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </Flex>
      </AntdRegistry>
    </main>
  );
}
