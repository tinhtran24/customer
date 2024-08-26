// components/CustomTabs.tsx
import React from "react";
import { Tabs, Button } from "antd";
import { Customer, CustomerProduct, Product } from "@/app/lib/definitions";
import type { TabsProps } from "antd/es/tabs";
import OrderProduct from "./Order";
import { History } from "./History";

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
  customerProducts
}: CustomTabsProps) {
  const items: TabsProps["items"] = [
    {
      label: "Mua bán",
      key: "1",
      children: (
        <OrderProduct
          products={products}
          customerId={customerId}
          provinces={provinces}
        />
      ),
    },
    {
      label: "Lịch sử",
      key: "2",
      children: <History customerProducts={customerProducts} />,
    },
    {
      label: "Trao đổi",
      key: "3",
      children: (
        <div>
          <textarea
            style={{
              width: "100%",
              height: "200px",
              padding: "1rem",
              fontSize: "16px",
              resize: "vertical",
              borderRadius: "12px",
            }}
            placeholder="Nhập nội dung ..."
          />
          <Button
            style={{
              marginTop: "1rem",
              display: "flex",
              marginLeft: "auto",
              fontSize: "17px",
              height: "39px",
              background: "lightgray",
              width: "100px",
              justifyContent: "center",
              border: "1px solid gray",
              fontWeight: "600",
            }}
          >
            Gửi
          </Button>
        </div>
      ),
    },
    {
      label: "Lịch hẹn",
      key: "4",
      children: `Content of Tab Pane2`,
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} />;
}
