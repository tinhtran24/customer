import { fetchAllProvinces } from "@/app/lib/data";
import CreateCustomerForm from "@/app/components/Customers/CreateForm";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Divider, Spin } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense } from "react";

export default async function CreateCustomerPage() {
  const provinces = await fetchAllProvinces();

  return (
    <main>
      <AntdRegistry>
        <Breadcrumb
          items={[
            {
              href: "/dashboard",
              title: <HomeOutlined />,
            },
            {
              href: "/dashboard/customers",
              title: (
                <>
                  <UserOutlined />
                  <span>Khách hàng</span>
                </>
              ),
            },
            {
              title: "Tạo mới",
            },
          ]}
        />

        <Divider />

        <Suspense fallback={<Spin size="large" />}>
          <CreateCustomerForm provinces={provinces} />
        </Suspense>
      </AntdRegistry>
    </main>
  );
}
