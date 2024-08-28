import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AuthProvider } from "@/app/components/auth";


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
        <body style={{ margin: 0, padding: 0 }}>
          <AntdRegistry>{children}</AntdRegistry>
        </body>
        </html>
      </AuthProvider>
  );
}
