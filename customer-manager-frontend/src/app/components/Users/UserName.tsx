import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Avatar } from "antd";

export default function User({ user }: { user: any }) {
  return (
    <Link
      href="/dashboard/profile"
      style={{ fontWeight: "bold", color: "#3C5B6F" }}
    >
      {user?.name}
      <Avatar
        style={{ backgroundColor: "#0d2f5f", margin: 8 }}
        icon={<UserOutlined />}
      />
    </Link>
  );
}
