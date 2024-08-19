import type { Metadata } from "next";
import { Flex, Image } from "antd";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Dashboard() {
  return (
    <main>
      <Flex justify="space-around">
        <Flex
          justify="flex-start"
          vertical
          style={{
            padding: "60px 0px 0px 15px",
          }}
        >
          <h1 style={{ color: "#8E3E63" }}>Xin chào,</h1>
          <div style={{ maxWidth: 500 }}>
            <p style={{ fontSize: 18, lineHeight: 1.7 }}>
              Đây chỉ là Project thử nghiệm, chủ yếu để luyện tập và test thử
              các tính năng. Mặc dù đã áp dụng một số phương pháp bảo mật cơ
              bản, tuy nhiên vui lòng không nhập các thông tin thật (bao gồm tên
              đăng nhập, mật khẩu, thông tin khách hàng, số điện thoại...), đề
              phòng trường hợp Website có thể bị hacker tấn công và lộ thông tin
              của bạn. Website không chịu trách nhiệm với những rò rỉ thông tin
              do không làm theo các cảnh báo trên. Rất vui được nhận các góp ý
              để hoàn thiện các tính năng. Xin cảm ơn ^_^ .
            </p>
          </div>
        </Flex>

        <Flex style={{ margin: 25, alignItems: "center" }}>
          <Image src="/avatar.webp" preview={false} />
        </Flex>
      </Flex>
    </main>
  );
}
