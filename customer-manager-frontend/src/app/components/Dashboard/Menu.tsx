"use client";
import { IdcardOutlined, DownSquareOutlined } from "@ant-design/icons";
import { FaRegUser, FaShippingFast, FaTasks } from "react-icons/fa";
import { GrDocumentConfig } from "react-icons/gr";
import { Menu } from "antd";
import type { GetProp, MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useLayoutEffect } from "react";
import { useAuthContext } from "@/app/components/auth";
import "./DashboardMenu.css";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { AiOutlineProduct } from "react-icons/ai";
import { MdPayment } from "react-icons/md";

type MenuItem = GetProp<MenuProps, "items">[number];

export const DashboardMenu = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [userRole, setUserRole] = useState("");
  const [current, setCurrent] = useState(
    pathname === "/" || pathname === "" ? "/dashboard" : pathname
  );
  const { currentUser, setCurrentUser } = useAuthContext();

  useEffect(() => {
    if (pathname) {
      if (current !== pathname) {
        setCurrent(pathname);
      }
    }
    if (currentUser) setUserRole(currentUser?.role);
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
      icon: <IdcardOutlined style={{ fontSize: "16px" }} />,
    },

    {
      key: "/dashboard/tasks",
      label: "Công việc",
      icon: <FaTasks style={{ fontSize: "16px" }} />,
    },
    userRole === "admin"
      ? {
          key: "/dashboard/setting",
          label: "Cấu hình",
          icon: <GrDocumentConfig style={{ fontSize: "16px" }} />,
          children: [
            {
              key: "/dashboard/admin",
              label: "Người dùng",
              icon: <span style={{marginLeft: "10px"}}><FaRegUser style={{ fontSize: "16px" }} /></span>,
            },
            {
              key: "/dashboard/products",
              label: "Sản phẩm",
              icon: <span style={{marginLeft: "10px"}}><AiOutlineProduct style={{ fontSize: "16px" }} /></span>,
            },
            {
              key: "/dashboard/customer-status",
              label: "Trạng thái KH",
              icon: <span style={{marginLeft: "10px"}}><HiOutlineStatusOnline style={{ fontSize: "16px" }} /></span>,
            },
            {
              key: "/dashboard/delivery-method",
              label: "PT vận chuyển",
              icon: <span style={{marginLeft: "10px"}}><FaShippingFast style={{ fontSize: "16px" }} /></span>,
            },
            {
              key: "/dashboard/payment-method",
              label: "PT thanh toán",
              icon: <span style={{marginLeft: "10px"}}><MdPayment style={{ fontSize: "16px" }} /></span>,
            },
            {
              key: "/dashboard/task-setting",
              label: "Mã công việc",
              icon: <span style={{marginLeft: "10px"}}><DownSquareOutlined style={{ fontSize: "16px" }} /></span>,
            },
          ],
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
      style={{ fontSize: "16px", fontWeight: "500" }}
      className="custom-dashboard-menu"
    />
  );
};
