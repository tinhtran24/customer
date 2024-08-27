"use client";
import {
  IdcardOutlined,
  FileTextOutlined,
  KeyOutlined,
  LaptopOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import type { GetProp, MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useLayoutEffect } from "react";
import { useAuthContext } from "@/app/components/auth";

type MenuItem = GetProp<MenuProps, "items">[number];

export default function DashboardMenu() {
  const pathname = usePathname();
  const router = useRouter();

  const [userRole, setUserRole] = useState("");
  const [current, setCurrent] = useState(
    pathname === "/" || pathname === "" ? "/dashboard" : pathname
  );
  const { currentUser, setCurrentUser } = useAuthContext()

  useEffect(() => {
    if (pathname) {
      if (current !== pathname) {
        setCurrent(pathname);
      }
    }
    if (currentUser) setUserRole(currentUser?.role)
  }, [pathname, current, currentUser]);

  useLayoutEffect(() => {
    fetch("/api/getUser")
      .then((res) => res.json())
      .then((data) => {
        setCurrentUser(data?.user);
      });
  }, []);

  const items: MenuItem[] = [
    {
      key: "/dashboard/customers",
      label: "Khách hàng",
      icon: <IdcardOutlined />,
    },
    {
      key: "/dashboard/products",
      label: "Sản phẩm",
      icon: <FileTextOutlined />,
    },
    {
      key: "/dashboard/appointments",
      label: "Lịch hẹn",
      icon:<LaptopOutlined />,
    },
    {
      key: "/dashboard/tasks",
      label: "Công việc",
      icon:<LaptopOutlined />,
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
