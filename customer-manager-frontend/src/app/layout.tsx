import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { AuthProvider } from "@/app/components/auth";

const inter = Inter({ subsets: ["vietnamese"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Orient Customer Manager",
    default: "Orient software",
  },
  description: "Ứng dụng quản lý khách khàng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <AuthProvider>
        <html lang="en" style={{ margin: 0, padding: 0 }}>
        <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <ConfigProvider
            theme={{
              token: {
                // Seed Token
                colorPrimary: "#0d2f5f",
                padding: 0,
                margin: 0,
              },
              components: {
                Layout: {
                  siderBg: "#f3f6fd",
                },

                Menu: {
                  itemBg: "#f3f6fd",
                  itemHoverBg: "#FFEFEF",
                  itemSelectedBg: "#0d2f5f",
                  itemActiveBg: "#CA8787",
                  itemSelectedColor: "white",
                  iconSize: 20,
                  fontSize: 16,
                },
              },
            }}
        >
          <AntdRegistry>{children}</AntdRegistry>
        </ConfigProvider>
        </body>
        </html>
      </AuthProvider>
  );
}
