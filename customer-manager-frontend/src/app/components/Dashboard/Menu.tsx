"use client";
import {
  IdcardOutlined,
  FileTextOutlined,
  KeyOutlined,
  LaptopOutlined
} from "@ant-design/icons";
import { FaTasks } from "react-icons/fa";
import { Menu } from "antd";
import type { GetProp, MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useLayoutEffect } from "react";
import { useAuthContext } from "@/app/components/auth";

type MenuItem = GetProp<MenuProps, "items">[number];

export const  DashboardMenu = () => {
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
      icon: <IdcardOutlined style={{fontSize: "18px"}} />,
    },
    {
      key: "/dashboard/products",
      label: "Sản phẩm",
      icon: <FileTextOutlined style={{fontSize: "18px"}}  />,
    },
    // {
    //   key: "/dashboard/appointments",
    //   label: "Lịch hẹn",
    //   icon:<LaptopOutlined  style={{fontSize: "18px"}} />,
    // },
    {
      key: "/dashboard/tasks",
      label: "Công việc",
      icon:<FaTasks  style={{fontSize: "18px"}} />,
    },
    userRole === "admin"
      ? {
          key: "/dashboard/admin",
          label: "Admin",
          icon: <KeyOutlined  style={{fontSize: "18px"}} />,
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
      style={{fontSize: "17px", fontWeight: "500"}}
    />
  );
}
