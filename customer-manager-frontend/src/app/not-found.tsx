import Link from "next/link";
import { Button, Result } from "antd";

export default function NotFound() {
  return (
    <main>
      <Result
        status="warning"
        title="Lỗi 404"
        subTitle="Trang bạn muốn tìm không tồn tại"
        extra={
          <Link href="/">
            <Button type="primary">Quay lại</Button>
          </Link>
        }
      />
    </main>
  );
}