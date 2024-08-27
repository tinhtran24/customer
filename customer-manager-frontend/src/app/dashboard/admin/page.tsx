import { Flex, Divider, Spin } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { shantell } from "@/app/utils/fontSetting";
import { CreateUser } from "@/app/components/Users/CreateUser";
import UserTable from "@/app/components/Users/UserTable";
import { fetchAllUsers } from "@/app/lib/data";

export default async function AdminPage() {
  const users = await fetchAllUsers();

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
              Users
            </h2>
            <CreateUser />
          </Flex>

          <Divider style={{ margin: 0 }} />

          <UserTable users={users} />
        </Flex>
      </AntdRegistry>
    </main>
  );
}
