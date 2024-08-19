import { fetchAllProvinces } from "@/app/lib/data";
import CreateCustomerForm from "@/app/components/Customers/CreateForm";
import { HomeOutlined, KeyOutlined } from "@ant-design/icons";
import { Breadcrumb, Divider, Spin } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense } from "react";
import CreateUserForm from "@/app/components/Users/CreateUserForm";

export default async function CreateUserPage() {
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
              href: "/dashboard/admin",
              title: (
                <>
                  <KeyOutlined />
                  <span>Admin</span>
                </>
              ),
            },
            {
              title: "Tạo mới",
            },
          ]}
        />

        <Divider />

        <CreateUserForm />
      </AntdRegistry>
    </main>
  );
}
