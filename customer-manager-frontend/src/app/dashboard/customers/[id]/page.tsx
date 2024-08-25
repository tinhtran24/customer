import { Breadcrumb, Divider, Spin } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { fetchCustomerById } from "@/app/lib/data";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { shantell } from "@/app/utils/fontSetting";
import { CustomersInfo } from "@/app/components/Customers/CustomerInfo";
import { TabsCustomer } from "@/app/components/Customers/TabsCustomer";
import { fetchAllProducts } from "@/app/lib/actions";

export default async function DetailCustomerPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const [customer, products] = await Promise.all([
    fetchCustomerById(id),
    fetchAllProducts()
  ]);

  if (!customer) {
    notFound();
  }

  return (
    <main style={{height: "100vh"}}>
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
              title: "Chi tiết khách hàng",
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
          <div style={{ display: "flex", gap: "2rem" }}>
            <div style={{ width: "30%" }}>
              <CustomersInfo customer={customer} />{" "}
            </div>
            <div style={{ width: "70%" }}>
              <TabsCustomer customer={customer} products={products} customerId={id}/>
            </div>
          </div>
        </Suspense>
      </AntdRegistry>
    </main>
  );
}
