import {
    IdcardOutlined,
    FileTextOutlined,
    KeyOutlined,
    LaptopOutlined
  } from "@ant-design/icons";
import React from 'react';
import { useAuthContext } from "../auth";

const getNavList = (t: any) => {
    const { currentUser, setCurrentUser } = useAuthContext()
    return [
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
          userRole === "admin"
            ? {
                key: "/dashboard/admin",
                label: "Admin",
                icon: <KeyOutlined />,
              }
            : null,
        ];
}

export default getNavList