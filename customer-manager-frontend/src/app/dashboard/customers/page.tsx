import CustomerTable from "@/app/components/Customers/Table";
import { Flex, Divider, Spin } from "antd";
import { CreateCustomer } from "@/app/components/Customers/Button";
import { fetchAllCustomers } from "@/app/lib/data";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense } from "react";
import { shantell } from "@/app/utils/fontSetting";

export default async function CustomerPage() {
  const customers = await fetchAllCustomers();

  return (
    <main>
      <AntdRegistry>
        <Flex justify="space-between" gap="large" vertical>
          <Flex justify="space-between" align="flex-end">
            <h2
              className={shantell.className}
              style={{
                color: "#8E3E63",
                alignItems: "end",
                padding: 0,
                margin: 0,
              }}
            >
              KHÁCH HÀNG
            </h2>
            <CreateCustomer />
          </Flex>

          <Divider style={{ margin: 0 }} />

          <Suspense fallback={<Spin size="large" />}>
            <CustomerTable customers={customers} />
          </Suspense>
        </Flex>
      </AntdRegistry>
    </main>
  );
}
