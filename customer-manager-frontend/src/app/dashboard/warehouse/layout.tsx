import { Metadata } from "next";
import { ConfigProvider } from "antd";

export const metadata: Metadata = {
  title: "Kho",
};

export default function WarehouseLayout({
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
          fontSize: 15,
          fontWeightStrong: 600,
        },
      }}
    >
      <div style={{ fontWeight: 500 }}>
        {children}
      </div>
    </ConfigProvider>
  );
}