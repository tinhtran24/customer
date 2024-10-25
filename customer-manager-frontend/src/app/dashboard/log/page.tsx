import { Flex, Divider, Spin } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense } from "react";
import { shantell } from "@/app/utils/fontSetting";
import LogTable from "@/app/components/Log/Table";

export default async function WarehousePage() {
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
              Log
            </h2>
          </Flex>
          <Divider style={{ margin: 0 }} />

          <Suspense fallback={<Spin size="large" />}>
            <LogTable />
          </Suspense>
        </Flex>
      </AntdRegistry>
    </main>
  );
}
