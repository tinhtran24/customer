import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AuthProvider } from "@/app/components/auth";
import dayjs from "dayjs";
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

// Initialize dayjs with timezone plugin; timzone plugin requires utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);


export const metadata: Metadata = {
  title: {
    template: "%s | Customer Manager",
    default: "Customer Manager",
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
        <body style={{ margin: 0, padding: 0 }}>
          <AntdRegistry>{children}</AntdRegistry>
        </body>
        </html>
      </AuthProvider>
  );
}
