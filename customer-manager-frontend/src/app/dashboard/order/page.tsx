"use client";
import { Flex, Divider, Spin } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense, useState } from "react";
import { shantell } from "@/app/utils/fontSetting";
import Table, { initFilterOrder } from "@/app/components/Order/Table";
import { FilterValues } from "@/app/components/Order/order.interface";
import { ExportButton } from "@/app/components/Order/ExportButton";

export default function ProductPage() {
  const [filteredValues, setFilteredValues] =
    useState<FilterValues>(initFilterOrder);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [orderIds, setOrderIds] = useState<{ page: number; ids: string[] }[]>(
    []
  );

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
              QUẢN LÝ ĐƠN HÀNG
            </h2>
            <ExportButton
              filteredValue={filteredValues}
              currentPage={currentPage}
              pageSize={pageSize}
              orderIds={orderIds.map((order) => order.ids).flat()}
            />
          </Flex>
          <Divider style={{ margin: 0 }} />

          <Suspense fallback={<Spin size="large" />}>
            <Table
              filteredValues={filteredValues}
              setFilteredValues={setFilteredValues}
              pageSize={pageSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              orderIds={orderIds}
              setOrderIds={setOrderIds}
            />
          </Suspense>
        </Flex>
      </AntdRegistry>
    </main>
  );
}
