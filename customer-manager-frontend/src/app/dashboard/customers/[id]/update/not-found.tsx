import Link from "next/link";
import { Button, Result } from "antd";

export default function NotFound() {
  return (
    <main>
      <Result
        status="warning"
        title="Lỗi 404"
        subTitle="Không thể tìm thấy khách hàng này"
        extra={
          <Button type="primary">
            <Link href="/dashboard/customers">Quay lại</Link>
          </Button>
        }
      />
    </main>
  );
}
