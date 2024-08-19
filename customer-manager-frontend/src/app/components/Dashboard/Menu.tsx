"use client";
import {
  IdcardOutlined,
  FileTextOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import type { GetProp, MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useLayoutEffect } from "react";

type MenuItem = GetProp<MenuProps, "items">[number];

export default function DashboardMenu() {
  const pathname = usePathname();
  const router = useRouter();

  const [userRole, setUserRole] = useState("");
  const [current, setCurrent] = useState(
    pathname === "/" || pathname === "" ? "/dashboard" : pathname
  );

  useEffect(() => {
    if (pathname) {
      if (current !== pathname) {
        setCurrent(pathname);
      }
    }
  }, [pathname, current]);

  useLayoutEffect(() => {
    fetch("/api/getUser")
      .then((res) => res.json())
      .then((data) => {
        setUserRole(data?.user?.role);
      });
  }, []);

  const items: MenuItem[] = [
    {
      key: "/dashboard/customers",
      label: "Khách hàng",
      icon: <IdcardOutlined />,
    },
    {
      key: "/dashboard/policies",
      label: "Đơn bảo hiểm",
      icon: <FileTextOutlined />,
    },
    userRole === "admin"
      ? {
          key: "/dashboard/admin",
          label: "Admin",
          icon: <KeyOutlined />,
        }
      : null,
  ];

  function handleClick(e: any) {
    router.push(e.key);
  }

  return (
    <Menu
      mode="inline"
      items={items}
      selectedKeys={[current]}
      onClick={handleClick}
    />
  );
}
