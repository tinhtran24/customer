import { Flex, Divider, Spin } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense } from "react";
import { shantell } from "@/app/utils/fontSetting";
import Table from "@/app/components/Order/Table";

export default function ProductPage() {
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
          </Flex>
          <Divider style={{ margin: 0 }} />

          <Suspense fallback={<Spin size="large" />}>
            <Table/>
          </Suspense>
        </Flex>
      </AntdRegistry>
    </main>
  );
}
