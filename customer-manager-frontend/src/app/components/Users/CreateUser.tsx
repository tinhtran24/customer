import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

export function CreateUser() {
  return (
    <Button type="primary">
      <Link href="/dashboard/admin/create-user">
        <span style={{ marginRight: 10 }}>Tạo mới</span> <PlusOutlined />
      </Link>
    </Button>
  );
}
