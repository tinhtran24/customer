import { Breadcrumb, Divider } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { fetchAllProvinces, fetchCustomerById } from "@/app/lib/data";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import UpdateCustomerForm from "@/app/components/Customers/UpdateForm";

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

  return (
    <main style={{ height: "100%" }}>
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
              title: "Cập nhật thông tin khách hàng",
            },
          ]}
        />

        <Divider style={{ margin: "24px 0px 10px 0px" }} />

        {/* <Suspense fallback={<Spin size="large" />}> */}
        <UpdateCustomerForm provinces={provinces} customer={customer} />
        {/* </Suspense> */}
      </AntdRegistry>
    </main>
  );
}
