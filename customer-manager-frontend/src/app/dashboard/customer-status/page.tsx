import { Flex, Divider, Spin } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense } from "react";
import { shantell } from "@/app/utils/fontSetting";
import { fetchSettings } from "@/app/lib/actions";
import CommonTable from "@/app/components/Common/Table";
import { SETTINGS_TYPE } from "@/app/lib/definitions";
import { CreateButton } from "@/app/components/Common/CreateProductButton";

const type = SETTINGS_TYPE.STATUS;

export default async function ProductPage() {
  const settings = await fetchSettings(type);

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
              QUẢN LÝ TRẠNG THÁI KHÁCH HÀNG
            </h2>
            <CreateButton type={type} />
          </Flex>
          <Divider style={{ margin: 0 }} />

          <Suspense fallback={<Spin size="large" />}>
            <CommonTable data={settings} type={type}/>
          </Suspense>
        </Flex>
      </AntdRegistry>
    </main>
  );
}
