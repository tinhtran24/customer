import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Space } from "antd";
import React from "react";

export function CreateCustomer() {
  return (
      <Flex align="flex-end">
          <Space size={"middle"}>
               <Button type="primary">
                   <Link href="/dashboard/customers/create">
                       <span style={{ marginRight: 10 }}>Tạo mới</span> <PlusOutlined />
                   </Link>
               </Button>
          </Space>
       </Flex>
  );
}
