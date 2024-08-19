import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Flex, Divider } from "antd";
import {
  MailOutlined,
  UserOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { shantell } from "@/app/utils/fontSetting";
import { getUserProfile } from "@/app/lib/data";

export default async function CustomerPage() {
  const userProfile = await getUserProfile();

  return (
    <main>
      <AntdRegistry>
        <Flex justify="space-between" gap="large" vertical>
          <Flex justify="space-between" align="flex-end">
            <h2
              className={shantell.className}
              style={{
                color: "#8E3E63",
                alignItems: "end",
                padding: 0,
                margin: 0,
              }}
            >
              PROFILE
            </h2>
          </Flex>

          <Divider style={{ margin: 0 }} />

          <Flex style={{ fontSize: 18 }} vertical>
            <div>
              <UserOutlined style={{ margin: 10 }} />
              {userProfile?.name}
            </div>

            <div>
              <MailOutlined style={{ margin: 10 }} />
              {userProfile?.email}
            </div>

            <div>
              <ApartmentOutlined style={{ margin: 10 }} />
              {userProfile?.role?.charAt(0).toUpperCase() +
                userProfile?.role?.slice(1)}
            </div>
          </Flex>
        </Flex>
      </AntdRegistry>
    </main>
  );
}
