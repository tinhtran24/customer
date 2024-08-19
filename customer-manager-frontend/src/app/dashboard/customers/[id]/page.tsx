import { Breadcrumb, Divider, Spin, Flex } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { fetchAllProvinces, fetchCustomerById } from "@/app/lib/data";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense } from "react";
import EditCustomerForm from "@/app/components/Customers/EditForm";
import { notFound } from "next/navigation";
import { shantell } from "@/app/utils/fontSetting";

export default async function DetailCustomerPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const [customer, provinces] = await Promise.all([
    fetchCustomerById(id),
    fetchAllProvinces(),
  ]);

  if (!customer) {
    notFound();
  }

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
              title: "Chi tiết",
            },
          ]}
        />

        <Divider style={{ margin: "24px 0px 10px 0px" }} />

        <div style={{ textAlign: "center" }}>
          <h2
            className={shantell.className}
            style={{
              color: "#8E3E63",
              alignItems: "end",
              padding: 0,
              margin: 15,
            }}
          >
            {customer.fullName?.toUpperCase()}
          </h2>
        </div>

        <Suspense fallback={<Spin size="large" />}>
          <EditCustomerForm customer={customer} provinces={provinces} />
        </Suspense>
      </AntdRegistry>
    </main>
  );
}
