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
              Customer manager
            </p>
          </div>
        </Flex>
      </Flex>
    </main>
  );
}
