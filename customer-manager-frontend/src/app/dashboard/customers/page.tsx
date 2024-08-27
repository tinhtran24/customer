import CustomerTable from "@/app/components/Customers/Table";
import { Flex, Divider, Spin } from "antd";
import { CreateCustomer } from "@/app/components/Customers/Button";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense } from "react";
import { shantell } from "@/app/utils/fontSetting";

export default function CustomerPage() {

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
              QUẢN LÝ KHÁCH HÀNG
            </h2>
            <CreateCustomer />
          </Flex>

          <Divider style={{ margin: 0 }} />

          <Suspense fallback={<Spin size="large" />}>
            <CustomerTable/>
          </Suspense>
        </Flex>
      </AntdRegistry>
    </main>
  );
}
