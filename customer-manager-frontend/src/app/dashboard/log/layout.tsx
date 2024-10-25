import { Metadata } from "next";
import { ConfigProvider } from "antd";

export const metadata: Metadata = {
  title: "Kho",
};

export default function LogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConfigProvider
      theme={{
        token: {
          padding: 15,
          margin: 15,
          fontSize: 14,
        },
      }}
    >
      <div style={{ fontWeight: 500 }}>
        {children}
      </div>
    </ConfigProvider>
  );
}