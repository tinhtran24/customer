// components/CustomTabs.tsx
import React from "react";
import { Tabs, Button } from "antd";
import { Customer, CustomerProduct, Product } from "@/app/lib/definitions";
import type { TabsProps } from "antd/es/tabs";
import OrderProduct from "./Order";
import { History } from "./History";
import { CreateCustomerAppointment } from "./CustomerAppointment";
import DiscussForm from "./DiscussForm";

interface CustomTabsProps {
  customer: Customer;
  products: Product[];
  customerId: string;
  provinces: any[];
  customerProducts: CustomerProduct[];
}

export function TabsCustomer({
  customer,
  products,
  customerId,
  provinces,
  customerProducts,
}: CustomTabsProps) {
  const items: TabsProps["items"] = [
    {
      label: "Trao đổi",
      key: "1",
      children: (
          <DiscussForm customerId={customerId} />
      ),
    },
    {
      label: "Mua bán",
      key: "2",
      children: (
        <OrderProduct
          products={products}
          customer={customer}
          provinces={provinces}
        />
      ),
    },
    {
      label: "Lịch sử mua",
      key: "3",
      children: <History customerProducts={customerProducts} />,
    },
    {
      label: "Lịch hẹn",
      key: "4",
      children: <CreateCustomerAppointment customerId={customerId} />,
    },
  ];
  return (
    <Tabs
      defaultActiveKey="1"
      items={items}
      style={{ height: "100%", minHeight: "100vh" }}
    />
  );
}
