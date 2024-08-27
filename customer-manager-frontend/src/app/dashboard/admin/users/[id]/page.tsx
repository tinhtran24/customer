import { Breadcrumb, Divider, Spin, Flex } from "antd";
import { HomeOutlined, KeyOutlined } from "@ant-design/icons";
import { fetchUserById } from "@/app/lib/data";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { shantell } from "@/app/utils/fontSetting";
import EditUserForm from "@/app/components/Users/UserEditForm";

export default async function DetailUserPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const user = await fetchUserById(id);

  if (!user) {
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
              href: "/dashboard/admin",
              title: (
                <>
                  <KeyOutlined />
                  <span>Admin</span>
                </>
              ),
            },
            {
              title: "Người dùng",
            },
          ]}
        />

        <Divider style={{ margin: "24px 0px 10px 0px" }} />

        <div style={{ textAlign: "center" }}>
          <h2
            className={shantell.className}
            style={{
              color: "#0d2f5f",
              alignItems: "end",
              padding: 0,
              margin: 15,
            }}
          >
            {user.name?.toUpperCase()}
          </h2>
        </div>

        <Suspense fallback={<Spin size="large" />}>
          <EditUserForm user={user} />
        </Suspense>
      </AntdRegistry>
    </main>
  );
}
