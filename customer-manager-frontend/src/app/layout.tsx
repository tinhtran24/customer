import type { Metadata } from "next";
import { Inter, Shantell_Sans } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

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
    <html lang="en" style={{ margin: 0, padding: 0 }}>
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <ConfigProvider
          theme={{
            token: {
              // Seed Token
              colorPrimary: "#8E3E63",
              padding: 0,
              margin: 0,
            },
            components: {
              Layout: {
                siderBg: "#6e87b7",
              },

              Menu: {
                itemBg: "#6e87b7",
                itemHoverBg: "#FFEFEF",
                itemSelectedBg: "#8e3e63",
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
  );
}
