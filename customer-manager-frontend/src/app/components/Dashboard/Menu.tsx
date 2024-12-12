"use client";
import { IdcardOutlined } from "@ant-design/icons";
import { FaRegUser, FaShippingFast, FaTasks } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { GrDocumentConfig } from "react-icons/gr";
import { Menu } from "antd";
import type { GetProp, MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useLayoutEffect } from "react";
import { useAuthContext } from "@/app/components/auth";
import "./DashboardMenu.css";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { AiOutlineProduct } from "react-icons/ai";
import {
  MdAddTask,
  MdOutlineDashboard,
  MdOutlineSource,
  MdPayment,
  MdProductionQuantityLimits,
} from "react-icons/md";
import { RiCustomerServiceLine } from "react-icons/ri";
import { TbBuildingWarehouse, TbShoppingCartSearch } from "react-icons/tb";
import { CgFileDocument } from "react-icons/cg";

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
        const currentTime = Math.floor(Date.now() / 1000);
        if (data?.user.exp < currentTime) {
          setCurrentUser(null)
        } else {
          setCurrentUser(data?.user);
        }
      });
  }, []);

  const items: MenuItem[] = [
    {
      key: "/dashboard/customers",
      label: "Khách hàng",
      icon: <IdcardOutlined style={{ fontSize: "16px" }} />,
    },
    {
      key: "/dashboard/order",
      label: "Đơn hàng",
      icon: <FaShop style={{ fontSize: "16px" }} />,
    },
    {
      key: "/dashboard/warehouse",
      label: "Kho",
      icon: <TbBuildingWarehouse style={{ fontSize: "16px" }} />,
    },
    currentUser?.role === "admin"
      ? {
          key: "/dashboard/log",
          label: "Log",
          icon: <CgFileDocument style={{ fontSize: "16px" }} />,
        }
      : null,
    {
      key: "/dashboard/tasks",
      label: "Công việc",
      icon: <FaTasks style={{ fontSize: "16px" }} />,
    },
    {
      key: "/dashboard",
      label: "Dashboard",
      icon: <MdOutlineDashboard style={{ fontSize: "16px" }} />,
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
              icon: (
                <span style={{ marginLeft: "10px" }}>
                  <FaRegUser style={{ fontSize: "16px" }} />
                </span>
              ),
            },
            {
              key: "/dashboard/products",
              label: "Sản phẩm",
              icon: (
                <span style={{ marginLeft: "10px" }}>
                  <AiOutlineProduct style={{ fontSize: "16px" }} />
                </span>
              ),
            },
            {
              key: "/dashboard/order-status",
              label: "Trạng thái ĐH",
              icon: (
                <span style={{ marginLeft: "10px" }}>
                  <TbShoppingCartSearch style={{ fontSize: "16px" }} />
                </span>
              ),
            },
            {
              key: "/dashboard/task-status",
              label: "Trạng thái CV",
              icon: (
                <span style={{ marginLeft: "10px" }}>
                  <MdAddTask style={{ fontSize: "16px" }} />
                </span>
              ),
            },
            {
              key: "/dashboard/customer-status",
              label: "Trạng thái KH",
              icon: (
                <span style={{ marginLeft: "10px" }}>
                  <HiOutlineStatusOnline style={{ fontSize: "16px" }} />
                </span>
              ),
            },
            {
              key: "/dashboard/customer-group",
              label: "Nhóm KH",
              icon: (
                <span style={{ marginLeft: "10px" }}>
                  <RiCustomerServiceLine style={{ fontSize: "16px" }} />
                </span>
              ),
            },
            {
              key: "/dashboard/customer-source",
              label: "Nguồn KH",
              icon: (
                <span style={{ marginLeft: "10px" }}>
                  <MdOutlineSource style={{ fontSize: "16px" }} />
                </span>
              ),
            },
            {
              key: "/dashboard/delivery-method",
              label: "PT vận chuyển",
              icon: (
                <span style={{ marginLeft: "10px" }}>
                  <FaShippingFast style={{ fontSize: "16px" }} />
                </span>
              ),
            },
            {
              key: "/dashboard/payment-method",
              label: "PT thanh toán",
              icon: (
                <span style={{ marginLeft: "10px" }}>
                  <MdPayment style={{ fontSize: "16px" }} />
                </span>
              ),
            },
            {
              key: "/dashboard/source-of-goods",
              label: "Kho",
              icon: (
                <span style={{ marginLeft: "10px" }}>
                  <MdProductionQuantityLimits style={{ fontSize: "16px" }} />
                </span>
              ),
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
